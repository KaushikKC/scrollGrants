// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract YieldGrants {
    uint256 public nextRoundId;
    uint256 public lastUpdateTime;

    struct Round {
        address owner;
        string metadata;
        uint256 matchingAmount;
        Project[] projects; // Changed to an array for graph compatibility
        uint256 nextProjectId;
        bool isActive;
    }

    struct Project {
        address owner;
        string metadata;
        uint256 totalDonations;
        uint64 impactAttestationId;
        uint256 pendingPayout;
        mapping(address => uint256) donations;
        address[] donors;
    }

    mapping(uint256 => Round) public rounds;
    mapping(address => uint256) public balances;

    // Events for clear indexing and monitoring
    event RoundCreated(
        uint256 indexed roundId,
        address indexed owner,
        string metadata,
        uint256 matchingAmount
    );

    event RoundEdited(uint256 indexed roundId, string newMetadata);

    event RoundDeactivated(
        uint256 indexed roundId,
        address indexed owner,
        uint256 totalDistributed
    );

    event ProjectApplied(
        uint256 indexed roundId,
        uint256 indexed projectId,
        address indexed owner,
        string metadata
    );

    event ProjectDonated(
        uint256 indexed roundId,
        uint256 indexed projectId,
        address indexed donor,
        uint256 amount
    );

    event BalanceToppedUp(address indexed user, uint256 amount);

    event ProjectFundsWithdrawn(
        uint256 indexed roundId,
        uint256 indexed projectId,
        address indexed owner,
        uint256 amount
    );

    constructor() {
        lastUpdateTime = block.timestamp;
    }

    // Create a new round with a matching amount
    function createRound(uint256 ma, string calldata m) external payable {
        require(ma > 0 && ma == msg.value, "Invalid amount");

        uint256 rId = nextRoundId++;
        Round storage r = rounds[rId];
        r.owner = msg.sender;
        r.matchingAmount = ma;
        r.metadata = m;
        r.isActive = true;

        emit RoundCreated(rId, msg.sender, m, ma);
    }

    // Top up user balance
    function topUpBalance() external payable {
        require(msg.value > 0, "Invalid amount");
        balances[msg.sender] += msg.value;
        emit BalanceToppedUp(msg.sender, msg.value);
    }

    // Edit the metadata of a round by the round owner
    function editRoundMetadata(
        uint256 rid,
        string calldata newMetadata
    ) external {
        require(rounds[rid].owner == msg.sender, "Not authorized");
        rounds[rid].metadata = newMetadata;
        emit RoundEdited(rid, newMetadata);
    }

    // Apply for a round with a project
    function applyForRound(uint256 rid, string calldata metadata) external {
        Round storage round = rounds[rid];
        require(round.isActive, "Round not active");

        uint256 pid = round.nextProjectId++;
        Project storage project = round.projects.push(); // Pushing new project to array
        project.owner = msg.sender;
        project.metadata = metadata;

        emit ProjectApplied(rid, pid, msg.sender, metadata);
    }

    // Donate to a project within a round
    function donate(uint256 rid, uint256 pid, uint256 amount) external {
        Round storage round = rounds[rid];
        require(
            round.isActive && balances[msg.sender] >= amount,
            "Invalid donation"
        );

        Project storage project = round.projects[pid];
        require(project.owner != address(0), "Project not found");

        project.donations[msg.sender] += amount;
        project.totalDonations += amount;
        balances[msg.sender] -= amount;

        emit ProjectDonated(rid, pid, msg.sender, amount);
    }

    // Distribute funds among projects based on their donations
    function distributeFunds(uint256 rId) external {
        Round storage r = rounds[rId];
        require(
            r.owner == msg.sender && r.isActive,
            "Not authorized or inactive"
        );

        uint256 tMatch = r.matchingAmount;
        uint256 tSqrtDonations = 0;
        uint256 totalDistributed = 0;

        // Calculate the sum of square roots of donations
        for (uint256 i = 0; i < r.projects.length; i++) {
            tSqrtDonations += Math.sqrt(r.projects[i].totalDonations);
        }

        require(tSqrtDonations > 0, "No donations");

        // Distribute matching funds based on the square root of donations
        for (uint256 i = 0; i < r.projects.length; i++) {
            Project storage p = r.projects[i];
            uint256 pShare = (Math.sqrt(p.totalDonations) * tMatch) /
                tSqrtDonations;
            uint256 amountToSend = p.totalDonations + pShare;
            totalDistributed += amountToSend;
            p.pendingPayout = amountToSend;
        }

        r.isActive = false;
        emit RoundDeactivated(rId, msg.sender, totalDistributed);
    }

    // Withdraw project funds by the project owner
    function withdrawProjectFunds(uint256 rId, uint256 pid) external {
        Project storage p = rounds[rId].projects[pid];

        // Ensure the caller is the project owner
        require(p.owner == msg.sender, "Not authorized");

        // Ensure there are funds to withdraw
        require(p.pendingPayout > 0, "No funds to withdraw");

        uint256 amount = p.pendingPayout;
        p.pendingPayout = 0; // Reset payout to prevent re-entrancy

        // Ensure the contract has sufficient balance to transfer the funds
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );

        // Transfer the amount to the project owner
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit ProjectFundsWithdrawn(rId, pid, msg.sender, amount);
    }
}
