import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BalanceToppedUp,
  ProjectApplied,
  ProjectDonated,
  ProjectFundsWithdrawn,
  RoundCreated,
  RoundDeactivated,
  RoundEdited
} from "../generated/ScrollGrant/ScrollGrant"

export function createBalanceToppedUpEvent(
  user: Address,
  amount: BigInt
): BalanceToppedUp {
  let balanceToppedUpEvent = changetype<BalanceToppedUp>(newMockEvent())

  balanceToppedUpEvent.parameters = new Array()

  balanceToppedUpEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  balanceToppedUpEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return balanceToppedUpEvent
}

export function createProjectAppliedEvent(
  roundId: BigInt,
  projectId: BigInt,
  owner: Address,
  metadata: string
): ProjectApplied {
  let projectAppliedEvent = changetype<ProjectApplied>(newMockEvent())

  projectAppliedEvent.parameters = new Array()

  projectAppliedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  projectAppliedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  projectAppliedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  projectAppliedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )

  return projectAppliedEvent
}

export function createProjectDonatedEvent(
  roundId: BigInt,
  projectId: BigInt,
  donor: Address,
  amount: BigInt
): ProjectDonated {
  let projectDonatedEvent = changetype<ProjectDonated>(newMockEvent())

  projectDonatedEvent.parameters = new Array()

  projectDonatedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  projectDonatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  projectDonatedEvent.parameters.push(
    new ethereum.EventParam("donor", ethereum.Value.fromAddress(donor))
  )
  projectDonatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return projectDonatedEvent
}

export function createProjectFundsWithdrawnEvent(
  roundId: BigInt,
  projectId: BigInt,
  owner: Address,
  amount: BigInt
): ProjectFundsWithdrawn {
  let projectFundsWithdrawnEvent = changetype<ProjectFundsWithdrawn>(
    newMockEvent()
  )

  projectFundsWithdrawnEvent.parameters = new Array()

  projectFundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  projectFundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  projectFundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  projectFundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return projectFundsWithdrawnEvent
}

export function createRoundCreatedEvent(
  roundId: BigInt,
  owner: Address,
  metadata: string,
  matchingAmount: BigInt
): RoundCreated {
  let roundCreatedEvent = changetype<RoundCreated>(newMockEvent())

  roundCreatedEvent.parameters = new Array()

  roundCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  roundCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  roundCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )
  roundCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "matchingAmount",
      ethereum.Value.fromUnsignedBigInt(matchingAmount)
    )
  )

  return roundCreatedEvent
}

export function createRoundDeactivatedEvent(
  roundId: BigInt,
  owner: Address,
  totalDistributed: BigInt
): RoundDeactivated {
  let roundDeactivatedEvent = changetype<RoundDeactivated>(newMockEvent())

  roundDeactivatedEvent.parameters = new Array()

  roundDeactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  roundDeactivatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  roundDeactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalDistributed",
      ethereum.Value.fromUnsignedBigInt(totalDistributed)
    )
  )

  return roundDeactivatedEvent
}

export function createRoundEditedEvent(
  roundId: BigInt,
  newMetadata: string
): RoundEdited {
  let roundEditedEvent = changetype<RoundEdited>(newMockEvent())

  roundEditedEvent.parameters = new Array()

  roundEditedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  roundEditedEvent.parameters.push(
    new ethereum.EventParam(
      "newMetadata",
      ethereum.Value.fromString(newMetadata)
    )
  )

  return roundEditedEvent
}
