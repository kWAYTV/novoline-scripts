// Create the module
var module = script.registerModule("Pluto.js", MISC);
module.addBooleanProperty("lowhp", "Low HP warning", false);
module.addBooleanProperty("nearby", "Nearby player warning", false);
module.addIntegerProperty("set_R","Nearby warning range", 5, 1, 10, 1);
module.addBooleanProperty("smartaura", "Smart Aura", false);
module.addBooleanProperty("smartstep", "Smart Step", false);
module.addBooleanProperty("fastuse", "Fast use", false);
module.addBooleanProperty("spammer", "Chat spammer", false);
module.addIntegerProperty("set_I","Chat spammer interval", 5, 1, 10, 1);
module.addBooleanProperty("timecounter", "Time Counter", false);
module.addStringProperty("timecounterstyle", "Time Counter Style", "Short", ["Short", "Full"]);
module.addDoubleProperty("Time Counter X","Time Counter X", 100, 10, 1000, 0.05)
module.addDoubleProperty("Time Counter Y","Time Counter Y", 100, 10, 1000, 0.05)
module.addBooleanProperty("hitlogs", "Hit Logs", false);
module.addBooleanProperty("print_hitlogs", "Send hitlogs to chat", false);

// Variables
var doLowHp = false;
var smartstep = false;
var smartaura = false;
var nearbyTimer = timer_util.getTimer();
var chatTimer = timer_util.getTimer();
var counterTimer = timer_util.getTimer();
var hlogsTimer = timer_util.getTimer();
var timeCounterSeconds = 0
var timeCounterMinutes = 0
var timeCounterHours = 0

// Log function
function log(text) {
    client.print("\u00a75\u00a7lPluto.js\u00A7f > " + text);
}

function lowHp() {
    if (module.getProperty("lowhp").getBoolean()) {
        if (player.getHealth() < 10 && doLowHp == false) {
            client.postNotification("Low HP Warning!" ,"Your HP is under 10", 3000, WARNING)
            log("\u00A7cYour HP is under 10!\u00A7f")
            doLowHp = true
        }else if (player.getHealth() > 10 && doLowHp == true) {
            client.postNotification("HP Warning" ,"Your HP is over 10 again", 3000, SUCCESS)
            log("\u00A7aYou are no longer on low HP!\u00A7f")
            doLowHp = false
        }
    }
}

// Nearby warning function
function nearbyWarning() {
    if (module.getProperty("nearby").getBoolean()) {
        var entities = world.getEntityList();
        var i;
        for(i = 0;i < entities.length;i++){
            if(player.getDistanceToEntity(entities[i]) < module.getProperty("set_R").getInteger() && entity_util.getName(entities[i]) != player.getName()){
                if (nearbyTimer.delay(1000) && entities[i] != null) {
                    log("\u00A7cWarning" + "\u00A7a	 " +entities[i].getName() + " \u00A7cis near!" + " \u00A7bDistance: \u00A7f" + Math.abs(player.getX() - entities[i].posX).toFixed(2)+ " blocks")
                    nearbyTimer.reset();
            }
        }
        }
    }
}

// Smart aura function
function smartAura() {
    if (module.getProperty("smartaura").getBoolean()) {
        if (client.isEnabled("Scaffold")) {
            if (client.isEnabled("Killaura")) {
                smartaura = true;
                client.toggleModule("Killaura");
                log("Smart aura disabled Killaura\u00A7f")
                client.postNotification("Smart Aura" ,"Aura Disabled", 3000, WARNING)	
        }
        } else if (smartaura) {
            client.toggleModule("Killaura");
            smartaura = false;
            log("Smart aura enabled Killaura\u00A7f")
            client.postNotification("Smart Aura" ,"Aura Enabled", 3000, SUCCESS)
        }
    }
}

// Smart step function
function smartStep() {
    if (module.getProperty("smartstep").getBoolean()) {
        if (client.isEnabled("Speed")) {
            if (client.isEnabled("Step")) {
                smartstep = true;
                client.toggleModule("Step");
                log("Smart step disabled step\u00A7f")	
                client.postNotification("Smart Step" ,"Step disabled", 3000, WARNING)	
        }
        } else if (smartstep) {
            client.toggleModule("Step");
            smartstep = false;
            log("Smart step enabled step\u00A7f")
            client.postNotification("Smart Step" ,"Step Enabled", 3000, SUCCESS)
        }
    }
}

// Fast use function
function fastUse(){
    if (module.getProperty("fastuse").getBoolean()) {
        if (player.getHeldItemDisplayName() === "Apple" || player.getHeldItemDisplayName() === "Golden Apple" 
        || player.getHeldItemDisplayName() === "Bread" || player.getHeldItemDisplayName() === "Cooked Chicken" 
        && !player.getHeldItemDisplayName() === "Fishing Rod" && !player.getHeldItemDisplayName() === "Bow"
        || player.getHeldItemDisplayName() === "Carrot" || player.getHeldItemDisplayName() === "Cooked Salmon" 
        || player.getHeldItemDisplayName() === "Cooked Fish" || player.getHeldItemDisplayName() === "Cooked Porkchop" 
        || player.getHeldItemDisplayName() === "Cooked Rabbit" || player.getHeldItemDisplayName() === "Cooked Mutton" 
        || player.getHeldItemDisplayName() === "Steak" && player.getHeldItem() != null) {
            for (var i = 0;i < 5; i++) {
                connection.sendPacket("0x03",false);
                connection.sendPacket("0x03",true);
            }
        }
    }
}

// Chat spammer function
function chatSpammer() {
    if (module.getProperty("spammer").getBoolean()) {
        if (chatTimer.delay(module.getProperty("set_I").getInteger() * 1000)) {
            player.sendMessage("kwayservices.top - Are you winning, son?")
            chatTimer.reset();
        }
    }
}

// Time counter function
function timeCounter(){
    if (module.getProperty("timecounter").getBoolean()) {
        if(counterTimer.delay(1000)){
            timeCounterSeconds++
            if (timeCounterSeconds >= 60 ) {
                timeCounterMinutes++
                timeCounterSeconds = 0
            }
            if (timeCounterMinutes >= 60 ) {
                timeCounterHours++
                timeCounterMinutes = 0
            }
            counterTimer.reset()
        }
        if (timeCounterHours == 1) { var fixedHours = "hour"} else { var fixedHours = "hours"}
        if (timeCounterMinutes == 1) { var fixedMinutes = "minute"} else { var fixedMinutes = "minutes"}
        if (timeCounterSeconds == 1) { var fixedSeconds = "second"} else { var fixedSeconds = "seconds"}
        if (module.getProperty("timecounterstyle").getString() == "Short") {
            render_util.renderString(timeCounterHours +":"+ timeCounterMinutes +":"+ timeCounterSeconds + "" , module.getProperty("Time Counter X").getDouble(), module.getProperty("Time Counter Y").getDouble(), 0xffffff, true);
        } else if (module.getProperty("timecounterstyle").getString() == "Full") {
            render_util.renderString(timeCounterHours + " " + fixedHours + " " + timeCounterMinutes + " " + fixedMinutes + " " + timeCounterSeconds + " " + fixedSeconds, module.getProperty("Time Counter X").getDouble(), module.getProperty("Time Counter Y").getDouble(), 0xffffff, true)
        }
    }
}

// Hit logs function
var outprint_hitlogs_timer = timer_util.getTimer();
function hitLogs() {
    var hitrate = Math.floor(Math.random() * 99 + 1);
    var getHitbox = Math.floor(Math.random() * 4 + 1);
    var finalHitbox = "";
    if (getHitbox == 1) {
        finalHitbox = "Head";
    } else if (getHitbox == 2) {
        finalHitbox = "Stomach";
    } else if (getHitbox == 3) {
        finalHitbox = "Body";
    } else if (getHitbox == 4) {
        finalHitbox = "Dick";
    } else if (getHitbox == 0) {
        finalHitbox = "Leg";
    }
    if (event.getPacket().getName() == "0x02") {
        if (hlogsTimer.delay(1000)) {
            log("\u00a72\u00a7lHit: \u00A7f" + client.getAuraTarget().getName() + " " + "\u00a77\u00a7lPos: \u00A7f" + finalHitbox + " " + "\u00a77\u00a7lHitrate: \u00A7f" + hitrate + " " + "\u00a77\u00a7lHRT: \u00A7f" + client.getAuraTarget().hurtResistantTime + " " +"\u00a77\u00a7lX: \u00A7f" + client.getAuraTarget().posX.toFixed(2) + " "  + "\u00a77\u00a7lY: \u00A7f" + client.getAuraTarget().posY.toFixed(2) + " " + "\u00a77\u00a7lZ: \u00A7f" + client.getAuraTarget().posZ.toFixed(2) + " " + "\u00a77\u00a7lHurt: \u00A7f" + (20.00 - entity_util.getHealth(client.getAuraTarget())).toFixed(2) + " " + "\u00a77\u00a7lHealth: \u00A7f" + entity_util.getHealth(client.getAuraTarget()).toFixed(2));
            hlogsTimer.reset();
    }
    if (module.getProperty("print_hitlogs").getBoolean()) {
        if (outprint_hitlogs_timer.delay(1000)) {
            player.sendMessage("Hit: " + client.getAuraTarget().getName() + " " + "Position: " + finalHitbox + " " + "HitRate: " + hitrate
            + " " + "HurtResistantTime: " + client.getAuraTarget().hurtResistantTime + " " +"X: " + client.getAuraTarget().posX.toFixed(2) + " " 
            + "Y: " + client.getAuraTarget().posY.toFixed(2) + " " + "Z: " + client.getAuraTarget().posZ.toFixed(2) + " " + "Hurt: " + (20.00 - entity_util.getHealth(client.getAuraTarget())).toFixed(2) + " " + "Health: " +
            entity_util.getHealth(client.getAuraTarget()).toFixed(2));
            outprint_hitlogs_timer.reset();
        }
    }
}}

// HTTP Request function
function request(url) {
    try {
        closeableHttpClient = org.apache.http.impl.client.HttpClients.createDefault();
        httpGet = new org.apache.http.client.methods.HttpGet(url);
        closeableHttpResponse = closeableHttpClient.execute(httpGet);
        var response = org.apache.commons.io.IOUtils.toString(closeableHttpResponse.getEntity().getContent(), java.nio.charset.StandardCharsets.UTF_8);
        if (response == "404: Not Found") {
            log("Loaded! While making the http request.\u00A7f")
        } else {
            var json = JSON.parse(response);
            return response
        }
    } catch (e) {
        log("Error!: \u00A7f" + e.message);
    }
}

// Script loading event
module.onEvent("enable",function(){
    var data = request("https://quotable.io/random?maxLength=150")
    var json = JSON.parse(data);
    log("Loaded! \n" + json.content + " - " + json.author);
    client.postNotification("Welcome","Pluto.js enabled!",3000,SUCCESS)
    player.jump()
});

// Script unloading event
module.onEvent("disable",function(){
    log("Thank you! Come again")
    client.postNotification("Goodbye","Thank you! Come again",3000,SUCCESS)
});

// Event listeners
module.onEvent("playerPostUpdateEvent",function(event){
    lowHp();
    nearbyWarning();
    smartAura();
    smartStep();
    chatSpammer();
})
module.onEvent("playerPreUpdateEvent",function(event){
    fastUse();
})
module.onEvent("render2DEvent",function(event){
    timeCounter();
})
module.onEvent("packetSendEvent",function(event){
    hitLogs(event);
})