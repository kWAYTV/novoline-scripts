module = script.registerModule("AutoBan",EXPLOITS);

module.onEvent("playerPreUpdateEvent",function(event){
     connection.sendPacket("0x18",player.getUUID());
});

module.onEvent("packetSendEvent",function(event){
    if(event.getPacket().getName() == "0x18"){
        client.print("C18PacketSpectate");
    }
});