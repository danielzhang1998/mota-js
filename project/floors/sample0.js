main.floors.sample0=
{
    "floorId": "sample0",
    "title": "样板 0 层",
    "name": "0",
    "canFlyTo": true,
    "canUseQuickShop": true,
    "defaultGround": "ground",
    "images": [],
    "bgm": "bgm.mp3",
    "ratio": 1,
    "map": [
    [  0,  0,220,  0,  0, 20, 87,  3, 65, 64, 44, 43, 42],
    [  0,246,  0,246,  0, 20,  0,  3, 58, 59, 60, 61, 41],
    [219,  0,  0,  0,219, 20,  0,  3, 57, 26, 62, 63, 40],
    [ 20, 20,125, 20, 20, 20,  0,  3, 53, 54, 55, 56, 39],
    [216,247,263,235,248,  6,  0,  3, 49, 50, 51, 52, 38],
    [  6,  6,125,  6,  6,  6,  0,  1, 45, 46, 47, 48, 37],
    [224,254,212,262,204,  5,  0,  1, 31, 32, 34, 33, 36],
    [201,261,217,264,207,  5,  0,  1, 27, 28, 29, 30, 35],
    [  5,  5,125,  5,  5,  5,  0,  1, 21, 22, 23, 24, 25],
    [  0,  0,237,  0,  0,  0, 45,  1,  1,  1,121,  1,  1],
    [  4,  4,133,  4,  4,  4,  0,  0,  0,  0,  0, 85,124],
    [ 87, 11, 12, 13, 14,  4,  4,  2,  2,  2,122,  2,  2],
    [ 88, 89, 90, 91, 92, 93, 94,  2, 81, 82, 83, 84, 86]
],
    "firstArrive": [
        {
            "type": "setText",
            "background": "winskin.png",
            "time": 0
        },
        "\t[样板提示]首次到达某层可以触发 firstArrive 事件，该事件可类似于RMXP中的“自动执行脚本”。\n\n本事件支持一切的事件类型，常常用来触发对话，例如：",
        "\t[hero]\b[up,hero]我是谁？我从哪来？我又要到哪去？",
        "\t[仙子,fairy]你问我...？我也不知道啊...",
        "本层主要对道具、门、怪物等进行介绍，有关事件的各种信息在下一层会有更为详细的说明。"
    ],
    "events": {
        "10,9": [
            "\t[老人,man]\b[down,null]这些是本样板支持的所有的道具。\n\n道具分为四类：items, constants, tools，equips。\nitems 为即捡即用类道具，例如宝石、血瓶等。\nconstants 为永久道具，例如怪物手册、楼层传送器、幸运金币等。\ntools 为消耗类道具，例如破墙镐、炸弹、中心对称飞行器等。\nequips 为装备，例如剑盾等。",
            "\t[老人,man]\b[up]有关道具效果，定义在project文件夹的items.js中。\n目前大多数道具已有默认行为，如有自定义的需求请修改道具的图块属性。",
            "\t[老人,man]\b[up]拾取道具结束后可触发 afterGetItem 事件。\n\n有关事件的各种信息在下一层会有更为详细的说明。",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "10,11": [
            "\t[老人,trader]\b[this]这些是门，需要对应的钥匙打开。\n机关门必须使用特殊的开法。",
            "\t[老人,trader]\b[this]开门后可触发 afterOpenDoor 事件。\n\n有关事件的各种信息在下一层会有更为详细的说明。",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "2,10": [
            "\t[少女,npc0]\b[this]这些是路障、楼梯、传送门。",
            "\t[少女,npc1]\b[this]血网的伤害数值、中毒后每步伤害数值、衰弱时攻防下降的数值，都在全塔属性（快捷键B）的全局数值（values）内定义。\n\n路障同样会尽量被自动寻路绕过。",
            "\t[少女,npc2]\b[this]楼梯和传送门需要在地图选点（快捷键X）的“楼层转换”中定义目标楼层和位置，可参见样板里已有的的写法。",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "2,5": [
            "\t[老人,wizard]\b[this]模仿、吸血、中毒、衰弱、诅咒。\n\n请注意吸血怪需要设置value为吸血数值，可参见样板中黑暗大法师的写法。",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "2,3": [
            "\t[老人,wizard]\b[this]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。",
            "\t[老人,wizard]\b[this]夹击和领域同时发生时先计算领域，再夹击。\n自动寻路同样会尽量绕过你设置的这些点。",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "12,10": {
            "trigger": null,
            "enable": false,
            "noPass": null,
            "displayDamage": true,
            "data": [
                "\t[仙子,fairy]\b[this]只有楼上启用事件后，才能看到我并可以和我对话来触发事件。",
                {
                    "type": "hide",
                    "time": 500
                }
            ]
        },
        "2,8": [
            "\t[老人,wizard]\b[this]这些都是各种各样的怪物，所有怪物的数据都在project文件夹的enemys.js中设置。",
            "\t[老人,wizard]\b[this]这批怪物分别为：普通、先攻、魔攻、坚固、2连击、3连击、4连击、破甲、反击、净化。",
            "\t[老人,wizard]\b[this]打败怪物后可触发 afterBattle 事件。\n\n有关事件的各种信息在下一层会有更为详细的说明。",
            {
                "type": "hide",
                "time": 500
            }
        ]
    },
    "changeFloor": {
        "6,0": {
            "floorId": "sample1",
            "stair": "downFloor"
        },
        "0,11": {
            "floorId": "sample0",
            "loc": [
                0,
                12
            ]
        },
        "0,12": {
            "floorId": "sample0",
            "stair": "upFloor"
        },
        "1,12": {
            "floorId": "sample0",
            "loc": [
                1,
                12
            ]
        },
        "2,12": {
            "floorId": "sample0",
            "loc": [
                2,
                12
            ]
        },
        "3,12": {
            "floorId": "sample0",
            "loc": [
                6,
                1
            ],
            "direction": "up"
        },
        "4,12": {
            "floorId": "sample0",
            "loc": [
                0,
                9
            ],
            "direction": "left",
            "time": 1000
        },
        "5,12": {
            "floorId": "sample0",
            "loc": [
                6,
                10
            ],
            "time": 0,
            "portalWithoutTrigger": false
        },
        "6,12": {
            "floorId": "sample0",
            "loc": [
                10,
                10
            ],
            "direction": "left",
            "time": 1000
        }
    },
    "afterBattle": {
        "2,6": [
            "\t[ghostSoldier]\b[this]不可能，你怎么可能打败我！\n（一个打败怪物触发的事件）"
        ]
    },
    "afterGetItem": {
        "11,8": [
            "由于状态栏放不下，铁门钥匙（根据全塔属性的系统开关勾选与否，可能还有绿钥匙）会被放入道具栏中。\n碰到绿门和铁门仍然会自动使用钥匙（根据全塔属性的系统开关勾选与否，铁门可能不需要钥匙）开门。"
        ],
        "8,6": [
            "由于吸血、夹击和净化等的存在，玩家可能希望自动寻路能尽量绕开血瓶和绿宝石，\n他们可以自行在游戏设置中开关这一功能。"
        ],
        "8,7": [
            "如需修改消耗品的效果，请前往全塔属性（快捷键B），找到并修改values（全局数值）内对应的具体数值即可。\n如果有高级的需求（如每个区域宝石数值变化），请修改楼层属性（快捷键V）最下方的“宝石血瓶效果”。\n如果有更高级的需求，请阅读帮助文档。"
        ],
        "9,5": [
            "每层楼的“可楼传”勾选框决定了该楼层能否被飞到。\n\n勇士在不能被飞到的楼层也无法使用楼层传送器。",
            "飞行的楼层顺序由全塔属性（快捷键B）中的“楼层列表”所决定。\n\n是否必须在楼梯边使用楼传器由全塔属性中的系统开关所决定。"
        ],
        "10,5": [
            "破墙镐是破面前的墙壁还是四个方向的墙壁，由其图块属性（快捷键C）的“使用效果”决定。\n哪些图块（怪物和道具除外）可以被破震，由该图块的图块属性中的“可破震”决定。"
        ],
        "8,4": [
            "炸弹是只能炸面前的怪物还是四个方向的怪物，由其图块属性（快捷键C）中的“使用效果”决定。\n不能被炸的怪物请直接在该怪物的图块属性中勾选“不可炸”，可参见样板里黑衣魔王和黑暗大法师的写法。"
        ],
        "10,4": [
            "“上楼”和“下楼”的目标层由全塔属性（快捷键B）的“楼层列表”顺序所决定。"
        ],
        "9,2": [
            "该道具默认是大黄门钥匙，如需改为钥匙盒直接修改其图块属性（快捷键C）的“道具类别”为items即可。"
        ],
        "10,2": [
            "屠龙匕首目前未被定义，可能需要自行实现功能。\n有关如何实现一个道具功能参见帮助文档。"
        ],
        "12,7": [
            "剑盾的道具类别设为equips才可以装备，\n如果设为items则会直接增加属性。"
        ],
        "12,6": [
            "在全塔属性（快捷键B）的系统开关中设置是否启用装备栏按钮。\n如果启用则装备栏按钮会替代楼传按钮。\n无论是否启用，玩家都可以双击道具栏按钮呼出装备栏。"
        ],
        "12,5": [
            "装备的种类由全塔属性（快捷键B）中的“装备孔”决定，每件装备的“类型”就是在“装备孔”中的索引，\n例如默认情况下0代表武器。同时，只有第一个装备孔中的装备，其“普攻动画”属性才会生效。"
        ]
    },
    "afterOpenDoor": {
        "11,12": [
            "你开了一个绿门，触发了一个afterOpenDoor事件"
        ]
    },
    "cannotMove": {},
    "bgmap": [

],
    "fgmap": [
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10169,  0,10177,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10170,  0,10185,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10169,  0,10179,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10172,  0,10180,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10186,  0,10181,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10187,  0,10182,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,10188,  0,10183,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
],
    "width": 13,
    "height": 13,
    "autoEvent": {}
}