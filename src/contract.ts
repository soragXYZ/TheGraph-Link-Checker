import { BigInt } from "@graphprotocol/graph-ts"
import { Contract, Transfer, Approval } from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleTransfer(event: Transfer): void {

  // dont get anything after 2021-08-10
  if(event.block.number >= BigInt.fromI32(13000000)) {
    return
  }

  // sender
  let sender = ExampleEntity.load(event.params.from.toHex())

  if (!sender) {
    sender = new ExampleEntity(event.params.from.toHex())

    sender.countInitiatedTx = BigInt.fromI32(0)
    sender.countReceivedTx = BigInt.fromI32(0)
    sender.valueReceived = BigInt.fromI32(0)
    sender.valueSent = BigInt.fromI32(0)
  }

  sender.countInitiatedTx = sender.countInitiatedTx + BigInt.fromI32(1)
  sender.valueSent = sender.valueSent + event.params.value

  sender.save()


  // receiver
  let receiver = ExampleEntity.load(event.params.to.toHex())

  if (!receiver) {
    receiver = new ExampleEntity(event.params.to.toHex())

    receiver.countInitiatedTx = BigInt.fromI32(0)
    receiver.countReceivedTx = BigInt.fromI32(0)
    receiver.valueReceived = BigInt.fromI32(0)
    receiver.valueSent = BigInt.fromI32(0)
  }

  receiver.countReceivedTx = receiver.countReceivedTx + BigInt.fromI32(1)
  receiver.valueReceived = receiver.valueReceived + event.params.value

  receiver.save()

}
