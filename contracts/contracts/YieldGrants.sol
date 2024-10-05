pragma solidity >=0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IAToken.sol";

contract YieldGrants {
    uint256 public nextRoundId;
    IPool public immutable aavePool;
    IAToken public immutable aToken;
    address public immutable aaveAsset;

    uint256 public totalDeposited;
    uint256 public lastUpdateTime;

    struct Round {
        address owner;
        string metadata;
        uint256 matchingAmount;
        mapping(uint256 => Project) projects;
        uint256[] projectIds;
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

    event RoundEvent(
        uint256 indexed rid,
        address indexed owner,
        uint256 amount,
        bool isCreated
    );
    event ProjectEvent(
        uint256 indexed rid,
        uint256 indexed pid,
        address indexed owner,
        uint256 amount
    );

    constructor(address _aavePool, address _aToken, address _aaveAsset) {
        aavePool = IPool(_aavePool);
        aToken = IAToken(_aToken);
        aaveAsset = _aaveAsset;
        lastUpdateTime = block.timestamp;
    }

    function createRound(uint256 ma, string calldata m) external payable {
        require(ma > 0 && ma == msg.value, "Invalid amount");
        uint256 rId = nextRoundId++;
        Round storage r = rounds[rId];
        r.owner = msg.sender;
        r.matchingAmount = ma;
        r.metadata = m;
        r.isActive = true;
        aavePool.supply(aaveAsset, ma, address(this), 0);
        totalDeposited += ma;
        emit RoundEvent(rId, msg.sender, ma, true);
    }

    function topUpBalance() external payable {
        require(msg.value > 0, "Invalid amount");
        balances[msg.sender] += msg.value;
        emit ProjectEvent(0, 0, msg.sender, msg.value);
    }

    function editRoundMetadata(
        uint256 rid,
        string calldata newMetadata
    ) external {
        require(rounds[rid].owner == msg.sender, "Not authorized");
        rounds[rid].metadata = newMetadata;
    }

    function applyForRound(uint256 rid, string calldata metadata) external {
        Round storage round = rounds[rid];
        require(round.isActive, "Round not active");
        uint256 pid = round.nextProjectId++;
        Project storage project = round.projects[pid];
        project.owner = msg.sender;
        project.metadata = metadata;
        round.projectIds.push(pid);
        emit ProjectEvent(rid, pid, msg.sender, 0);
    }

    function donate(uint256 rid, uint256 pid, uint256 amount) external {
        Round storage round = rounds[rid];
        require(
            round.isActive && balances[msg.sender] >= amount,
            "Invalid donation"
        );
        Project storage project = round.projects[pid];
        require(project.owner != address(0), "Project not found");
        project.donations[msg.sender] = amount;
        project.totalDonations += amount;
        balances[msg.sender] -= amount;
        emit ProjectEvent(rid, pid, msg.sender, amount);
    }

    function distributeFunds(uint256 rId) external {
        Round storage r = rounds[rId];
        require(
            r.owner == msg.sender && r.isActive,
            "Not authorized or inactive"
        );
        uint256 tMatch = r.matchingAmount;
        uint256 tSqrtDonations = 0;
        uint256 totalDistributed = 0;
        uint256[] memory pIds = r.projectIds;
        for (uint256 i = 0; i < pIds.length; i++) {
            tSqrtDonations += Math.sqrt(r.projects[pIds[i]].totalDonations);
        }
        require(tSqrtDonations > 0, "No donations");
        uint256 yield = aToken.balanceOf(address(this)) - totalDeposited;
        for (uint256 i = 0; i < pIds.length; i++) {
            Project storage p = r.projects[pIds[i]];
            uint256 pShare = (Math.sqrt(p.totalDonations) * tMatch) /
                tSqrtDonations;
            uint256 yieldShare = (pShare * yield) / tMatch;
            uint256 amountToSend = p.totalDonations + pShare + yieldShare;
            totalDistributed += amountToSend;
            p.pendingPayout = amountToSend;
        }
        r.isActive = false;
        emit RoundEvent(rId, msg.sender, totalDistributed, false);
    }

    function withdrawProjectFunds(uint256 rId, uint256 pid) external {
        Project storage p = rounds[rId].projects[pid];
        require(
            p.owner == msg.sender && p.pendingPayout > 0,
            "Not authorized or no funds"
        );
        uint256 amount = p.pendingPayout;
        p.pendingPayout = 0;
        aavePool.withdraw(aaveAsset, amount, address(this));
        totalDeposited -= amount;
        payable(msg.sender).transfer(amount);
        emit ProjectEvent(rId, pid, msg.sender, amount);
    }
}
