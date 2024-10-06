import { BigInt, Bytes, json, JSONValue, log } from "@graphprotocol/graph-ts";
import {
  BalanceToppedUp as BalanceToppedUpEvent,
  ProjectApplied as ProjectAppliedEvent,
  ProjectDonated as ProjectDonatedEvent,
  ProjectFundsWithdrawn as ProjectFundsWithdrawnEvent,
  RoundCreated as RoundCreatedEvent,
  RoundDeactivated as RoundDeactivatedEvent,
  RoundEdited as RoundEditedEvent,
} from "../generated/ScrollGrant/ScrollGrant";
import {
  BalanceToppedUp,
  ProjectApplied,
  ProjectDonated,
  ProjectFundsWithdrawn,
  RoundCreated,
  RoundDeactivated,
  RoundEdited,
  Round,
  Project,
} from "../generated/schema";

// Handle Balance Topped Up event
export function handleBalanceToppedUp(event: BalanceToppedUpEvent): void {
  let entity = new BalanceToppedUp(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

// Handle Project Applied event
export function handleProjectApplied(event: ProjectAppliedEvent): void {
  // Create or load the Project entity
  let projectId = event.params.projectId.toString();
  let roundId = event.params.roundId.toString();
  let uniqueProjectId = roundId + "-" + projectId;
  let project = new Project(uniqueProjectId);
  project.round = event.params.roundId.toString(); // Set the associated round
  project.owner = event.params.owner;
  project.metadata = event.params.metadata;
  project.totalDonations = BigInt.fromI32(0); // Initialize total donations to 0
  project.pendingPayout = BigInt.fromI32(0); // Initialize pending payout to 0
  project.donors = []; // Initialize donors list as empty
  project.blockNumber = event.block.number;
  project.blockTimestamp = event.block.timestamp;
  project.transactionHash = event.transaction.hash;
  let metadata = json.fromString(event.params.metadata);

  let projectName = metadata.toObject().get("projectName"); // Retrieve project name

  let osoName = metadata.toObject().get("osoName"); // Retrieve OSO name
  let website = metadata.toObject().get("website"); // Retrieve website

  let twitterUrl = metadata.toObject().get("twitterUrl"); // Retrieve Twitter URL
  let logoUrl = metadata.toObject().get("logoUrl"); // Retrieve logo URL

  let coverUrl = metadata.toObject().get("coverUrl"); // Retrieve cover URL

  let teamSize = metadata.toObject().get("teamSize"); // Retrieve team size

  let projectDescription = metadata.toObject().get("projectDescription"); // Retrieve project description
  // Assign values to the project entity, handling nulls and converting types as necessary

  project.projectName = projectName ? projectName.toString() : null; // Populate project name

  project.osoName = osoName ? osoName.toString() : null; // Populate OSO name

  project.website = website ? website.toString() : null; // Populate website

  project.twitterUrl = twitterUrl ? twitterUrl.toString() : null; // Populate Twitter URL

  project.logoUrl = logoUrl ? logoUrl.toString() : null; // Populate logo URL

  project.coverUrl = coverUrl ? coverUrl.toString() : null; // Populate cover URL

  project.teamSize = teamSize ? teamSize.toString() : null; // Populate team size

  project.projectDescription = projectDescription
    ? projectDescription.toString()
    : null; // Populate project description

  project.save();

  // Create ProjectApplied entity
  let appliedEntity = new ProjectApplied(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  appliedEntity.roundId = event.params.roundId;
  appliedEntity.projectId = event.params.projectId;
  appliedEntity.owner = event.params.owner;
  appliedEntity.metadata = event.params.metadata;

  appliedEntity.blockNumber = event.block.number;
  appliedEntity.blockTimestamp = event.block.timestamp;
  appliedEntity.transactionHash = event.transaction.hash;

  appliedEntity.save(); // Save the applied entity
}

// Handle Project Donated event
export function handleProjectDonated(event: ProjectDonatedEvent): void {
  let projectId = event.params.projectId.toString();
  let roundId = event.params.roundId.toString();
  let uniqueProjectId = roundId + "-" + projectId;
  let project = Project.load(uniqueProjectId);

  // Update the project entity

  if (project) {
    project.totalDonations = project.totalDonations.plus(event.params.amount);
    project.pendingPayout = project.pendingPayout.plus(event.params.amount);
    project.donors.push(event.params.donor);
    project.save();
  }

  let entity = new ProjectDonated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.roundId = event.params.roundId; // Convert Round ID to Bytes
  entity.projectId = event.params.projectId; // Convert Project ID to Bytes
  entity.donor = event.params.donor;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

// Handle Project Funds Withdrawn event
export function handleProjectFundsWithdrawn(
  event: ProjectFundsWithdrawnEvent
): void {
  let projectId = event.params.projectId.toString();
  let roundId = event.params.roundId.toString();
  let uniqueProjectId = roundId + "-" + projectId;
  let project = Project.load(uniqueProjectId);

  if (project) {
    project.pendingPayout = project.pendingPayout.minus(event.params.amount);
    project.save();
  }
  let entity = new ProjectFundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.roundId = event.params.roundId; // Convert Round ID to Bytes
  entity.projectId = event.params.projectId; // Convert Project ID to Bytes
  entity.owner = event.params.owner;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

// Handle Round Created event
export function handleRoundCreated(event: RoundCreatedEvent): void {
  let roundId = event.params.roundId.toString(); // Convert Round ID to Bytes
  let round = new Round(roundId);
  round.owner = event.params.owner;
  round.metadata = event.params.metadata;
  round.matchingAmount = event.params.matchingAmount;
  round.isActive = true; // Set as active upon creation
  round.totalDistributed = BigInt.fromI32(0); // Initialize total distributed to 0

  round.blockNumber = event.block.number;
  round.blockTimestamp = event.block.timestamp;
  round.transactionHash = event.transaction.hash;

  let metadata = json.fromString(event.params.metadata);
  let roundName = metadata.toObject().get("roundName"); // Retrieve round name

  let description = metadata.toObject().get("description"); // Retrieve round description
  let startDate = metadata.toObject().get("startDate"); // Retrieve start date
  let endDate = metadata.toObject().get("endDate"); // Retrieve end date

  round.roundName = roundName ? roundName.toString() : null; // Populate round name

  round.roundDescription = description ? description.toString() : null; // Populate round description

  round.startDate = startDate ? startDate.toString() : null; // Populate start date

  round.endDate = endDate ? endDate.toString() : null; // Populate end date

  round.save();

  // Create RoundCreated entity
  let createdEntity = new RoundCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  createdEntity.roundId = event.params.roundId; // Use round ID
  createdEntity.owner = event.params.owner;
  createdEntity.metadata = event.params.metadata;
  createdEntity.matchingAmount = event.params.matchingAmount;

  createdEntity.blockNumber = event.block.number;
  createdEntity.blockTimestamp = event.block.timestamp;
  createdEntity.transactionHash = event.transaction.hash;

  createdEntity.save(); // Save the created entity
}

// Handle Round Deactivated event
export function handleRoundDeactivated(event: RoundDeactivatedEvent): void {
  let roundId = event.params.roundId.toString(); // Convert Round ID to String
  let round = Round.load(roundId);

  if (round) {
    round.isActive = false;
    round.save();
  }
  let entity = new RoundDeactivated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.roundId = event.params.roundId; // Convert Round ID to Bytes
  entity.owner = event.params.owner;
  entity.totalDistributed = event.params.totalDistributed;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

// Handle Round Edited event
export function handleRoundEdited(event: RoundEditedEvent): void {
  let entity = new RoundEdited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.roundId = event.params.roundId; // Convert Round ID to Bytes
  entity.newMetadata = event.params.newMetadata;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
