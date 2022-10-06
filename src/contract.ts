import { BigInt } from "@graphprotocol/graph-ts"
import { TransferCall } from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleTransfer(call: TransferCall): void {

  // // dont get anything after 2021-08-10
  if(call.block.number >= BigInt.fromI32(13000000)) {
    return
  }

  // sender
  let sender = ExampleEntity.load(call.transaction.from.toHex())

  

  if (!sender) {
    sender = new ExampleEntity(call.transaction.from.toHex())

    sender.countInitiatedTx = BigInt.fromI32(0)
    sender.countReceivedTx = BigInt.fromI32(0)
    sender.valueReceived = BigInt.fromI32(0)
    sender.valueSent = BigInt.fromI32(0)
  }

  sender.countInitiatedTx = sender.countInitiatedTx + BigInt.fromI32(1)
  sender.valueSent = sender.valueSent + call.inputs._value

  sender.save()


  // receiver
  let receiver = ExampleEntity.load(call.inputs._to.toHex())

  if (!receiver) {
    receiver = new ExampleEntity(call.inputs._to.toHex())

    receiver.countInitiatedTx = BigInt.fromI32(0)
    receiver.countReceivedTx = BigInt.fromI32(0)
    receiver.valueReceived = BigInt.fromI32(0)
    receiver.valueSent = BigInt.fromI32(0)
  }

  receiver.countReceivedTx = receiver.countReceivedTx + BigInt.fromI32(1)
  receiver.valueReceived = receiver.valueReceived + call.inputs._value

  receiver.save()

}
