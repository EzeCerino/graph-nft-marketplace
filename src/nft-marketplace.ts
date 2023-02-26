import {
  ItemBougth as ItemBougthEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace"
//import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ActiveItem,
  ItemListed,
  ItemBougth,
  ItemCanceled,
} from "../generated/schema"

export function handleItemBougth(event: ItemBougthEvent): void {
  //save the event
  //update activeitems
  //get or create an item listed object
  //each item needs an unique id
  let itemBougth = ItemBougth.load(
    getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemBougth) {
    new ItemBougth(
      getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBougth!.buyer = event.params.buyer
  itemBougth!.nftAddress = event.params.nftAddress
  itemBougth!.tokenId = event.params.tokenId
  activeItem!.buyer = event.params.buyer

  itemBougth!.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  )
  itemCanceled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
    )
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventPrams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  )

  itemListed.save()
  activeItem.save()
}

function getIdFromEventPrams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
  //https://youtu.be/gyMwXuJrbJQ?t=102840
}
