/*
 * Tap & Read
 *
 * The two JSON files in /data are static Emojibase compact datasets.
 * The app merges them by Unicode hexcode so labels and tags stay in sync
 * while the page remains fully usable on GitHub Pages without a backend.
 */

const LANGUAGES = {
  zh: { label: "中文", voice: "zh-CN" },
  en: { label: "English", voice: "en-US" },
};

const GROUPS = {
  people: new Set([1]),
  animals: new Set([3]),
  food: new Set([4]),
  travel: new Set([5]),
  activities: new Set([6]),
  objects: new Set([7]),
  symbols: new Set([8]),
  flags: new Set([9]),
};

const SKIN_TONE_CODES = new Set(["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]);

const VOICE_PREFERENCES = {
  en: [
    /natural/i,
    /google.*english/i,
    /aria|jenny|ava|sara|samantha|zira/i,
    /online/i,
  ],
  zh: [
    /xiaoxiao|xiaoyi|yunxi|yunyang|yaoyao/i,
    /natural/i,
    /google.*(中文|普通话|chinese|mandarin)/i,
    /ting-ting|sin-ji|mei-jia/i,
    /online/i,
  ],
};

const FEATURED_HEXCODES = [
  "1F34E", // red apple
  "1F436", // dog face
  "1F431", // cat face
  "1F43B", // bear
  "1F98B", // butterfly
  "1F33C", // blossom
  "1F349", // watermelon
  "1F34C", // banana
  "1F353", // strawberry
  "1F95B", // glass of milk
  "1F964", // cup with straw
  "1F355", // pizza
  "1F354", // hamburger
  "1F36A", // cookie
  "1F4A7", // droplet
  "2600",   // sun
  "1F319",  // crescent moon
  "1F697",  // automobile
  "1F68C",  // bus
  "1F3E0",  // house
  "1F3C0",  // basketball
  "26BD",    // soccer ball
  "1F381",  // wrapped gift
  "1F9F8",  // teddy bear
];

// Short, familiar game names are independent of the browsing dictionary.
const GAME_THEMES = ["animals", "ocean", "produce", "food", "transport", "nature", "home", "play"];

const GAME_WORDS = [
  ["1F436", "animals", "小狗", "dog"],
  ["1F431", "animals", "小猫", "cat"],
  ["1F430", "animals", "兔子", "rabbit"],
  ["1F42E", "animals", "奶牛", "cow"],
  ["1F437", "animals", "小猪", "pig"],
  ["1F434", "animals", "马", "horse"],
  ["1F42D", "animals", "老鼠", "mouse"],
  ["1F98B", "animals", "蝴蝶", "butterfly"],
  ["1F43B", "animals", "棕熊", "brown bear"],
  ["1F43C", "animals", "熊猫", "panda"],
  ["1F428", "animals", "考拉", "koala"],
  ["1F981", "animals", "狮子", "lion"],
  ["1F420", "ocean", "热带鱼", "tropical fish"],
  ["1F42C", "ocean", "海豚", "dolphin"],
  ["1F433", "ocean", "鲸鱼", "whale"],
  ["1F988", "ocean", "鲨鱼", "shark"],
  ["1F419", "ocean", "章鱼", "octopus"],
  ["1F991", "ocean", "乌贼", "squid"],
  ["1F980", "ocean", "螃蟹", "crab"],
  ["1F99E", "ocean", "龙虾", "lobster"],
  ["1F990", "ocean", "虾", "shrimp"],
  ["1F9AD", "ocean", "海豹", "seal"],
  ["1FABC", "ocean", "水母", "jellyfish"],
  ["1FAB8", "ocean", "珊瑚", "coral"],
  ["1F34E", "produce", "苹果", "apple"],
  ["1F34C", "produce", "香蕉", "banana"],
  ["1F349", "produce", "西瓜", "watermelon"],
  ["1F353", "produce", "草莓", "strawberry"],
  ["1F347", "produce", "葡萄", "grapes"],
  ["1F34D", "produce", "菠萝", "pineapple"],
  ["1F955", "produce", "胡萝卜", "carrot"],
  ["1F33D", "produce", "玉米", "corn"],
  ["1F966", "produce", "西兰花", "broccoli"],
  ["1F345", "produce", "西红柿", "tomato"],
  ["1F954", "produce", "土豆", "potato"],
  ["1F346", "produce", "茄子", "eggplant"],
  ["1F355", "food", "披萨", "pizza"],
  ["1F354", "food", "汉堡", "burger"],
  ["1F35F", "food", "薯条", "fries"],
  ["1F32D", "food", "热狗", "hot dog"],
  ["1F32F", "food", "卷饼", "burrito"],
  ["1F96A", "food", "三明治", "sandwich"],
  ["1F363", "food", "寿司", "sushi"],
  ["1F35C", "food", "面条", "noodles"],
  ["1F36A", "food", "饼干", "cookie"],
  ["1F366", "food", "冰淇淋", "ice cream"],
  ["1F95B", "food", "牛奶", "milk"],
  ["1F9C3", "food", "果汁盒", "juice box"],
  ["1F697", "transport", "汽车", "car"],
  ["1F695", "transport", "出租车", "taxi"],
  ["1F68C", "transport", "公交车", "bus"],
  ["1F69A", "transport", "货车", "truck"],
  ["1F69C", "transport", "拖拉机", "tractor"],
  ["1F6B2", "transport", "自行车", "bicycle"],
  ["1F6F4", "transport", "滑板车", "scooter"],
  ["1F3CD", "transport", "摩托车", "motorcycle"],
  ["1F682", "transport", "火车", "train"],
  ["2708", "transport", "飞机", "airplane"],
  ["1F681", "transport", "直升机", "helicopter"],
  ["1F6A2", "transport", "轮船", "ship"],
  ["2600", "nature", "太阳", "sun"],
  ["1F319", "nature", "月亮", "moon"],
  ["2601", "nature", "云", "cloud"],
  ["1F308", "nature", "彩虹", "rainbow"],
  ["2744", "nature", "雪花", "snowflake"],
  ["1F30A", "nature", "浪花", "wave"],
  ["1F30B", "nature", "火山", "volcano"],
  ["1F333", "nature", "树", "tree"],
  ["1F33C", "nature", "花", "flower"],
  ["1F335", "nature", "仙人掌", "cactus"],
  ["1F344", "nature", "蘑菇", "mushroom"],
  ["1F4A7", "nature", "水滴", "water drop"],
  ["1F3E0", "home", "房子", "house"],
  ["1FA91", "home", "椅子", "chair"],
  ["1F6CF", "home", "床", "bed"],
  ["1F6C1", "home", "浴缸", "bathtub"],
  ["1F511", "home", "钥匙", "key"],
  ["1F4A1", "home", "灯泡", "light bulb"],
  ["1F455", "home", "T恤", "T-shirt"],
  ["1F456", "home", "牛仔裤", "jeans"],
  ["1F457", "home", "连衣裙", "dress"],
  ["1F45F", "home", "鞋", "shoe"],
  ["1F9E2", "home", "帽子", "hat"],
  ["1F392", "home", "书包", "backpack"],
  ["1F9F8", "play", "玩具熊", "teddy bear"],
  ["1FA80", "play", "悠悠球", "yo-yo"],
  ["1FA81", "play", "风筝", "kite"],
  ["1F9E9", "play", "拼图", "puzzle"],
  ["1F3C0", "play", "篮球", "basketball"],
  ["26BD", "play", "足球", "soccer ball"],
  ["1F381", "play", "礼物", "gift"],
  ["1F3BE", "play", "网球", "tennis ball"],
  ["1F3B8", "play", "吉他", "guitar"],
  ["1F3B9", "play", "琴键", "piano keys"],
  ["1F941", "play", "鼓", "drum"],
  ["1F3A4", "play", "麦克风", "microphone"],
].map(([hexcode, theme, zh, en]) => ({ hexcode, theme, labels: { zh, en } }));

// Curated concept questions: each row has one reviewed answer and intentional distractors.
// `type` and `concept` let the deck keep adjacent questions varied without changing the UI.
const GAME_QUESTIONS = [
  ["animals-meow", "animals", "warmup", "cat-sound", "哪种动物会喵喵叫？", "Which animal says meow?", ["1F431"], ["1F436", "1F430", "1F42E", "1F437"]],
  ["animals-woof", "animals", "warmup", "dog-sound", "哪种动物会汪汪叫？", "Which animal says woof?", ["1F436"], ["1F431", "1F430", "1F437", "1F981"]],
  ["animals-milk", "animals", "relation", "cow-milk", "我们喝的牛奶和哪种动物最有关系？", "Which animal is most closely connected with the milk we drink?", ["1F42E"], ["1F434", "1F437", "1F43B", "1F436"]],
  ["animals-butterfly-flight", "animals", "dual", "butterfly-flight", "哪个会飞，而且不是交通工具？", "Which one can fly and is not a vehicle?", ["1F98B"], ["2708", "1F436", "1F697"]],
  ["animals-butterfly-flight-2", "animals", "dual", "butterfly-flight", "找一个能飞上天空、又不是交通工具的小动物。", "Find a small animal that can fly in the sky and is not a vehicle.", ["1F98B"], ["2708", "1F436", "1F697"]],
  ["animals-rabbit-clues", "animals", "dual", "rabbit-clues", "哪个会蹦跳，而且有长长的耳朵？", "Which one hops and has long ears?", ["1F430"], ["1F42D", "1F431", "1F43B", "1F437"]],
  ["animals-panda-clues", "animals", "dual", "panda-clues", "哪个是熊，而且身上黑白相间？", "Which one is a bear with black-and-white fur?", ["1F43C"], ["1F43B", "1F428", "1F42E", "1F981"]],
  ["animals-lion-clues", "animals", "dual", "lion-clues", "哪个像大猫，头周围常有一圈长毛？", "Which one is a big cat whose head can have a mane?", ["1F981"], ["1F431", "1F43B", "1F42E", "1F434"]],
  ["animals-not-animal", "animals", "exclusion", "animal-exclusion", "小狗、小猫、飞机里，哪个不是动物？", "Dog, cat, airplane: which one is not an animal?", ["2708"], ["1F436", "1F431"]],

  ["ocean-octopus", "ocean", "dual", "octopus-arms", "哪个有八条腕，而且不是鱼？", "Which one has eight arms and is not a fish?", ["1F419"], ["1F420", "1F988", "1F42C", "1FAB8"]],
  ["ocean-octopus-2", "ocean", "dual", "octopus-arms", "海里哪个不是鱼，却有八条腕？", "Which sea creature is not a fish but has eight arms?", ["1F419"], ["1F420", "1F988", "1F42C", "1FAB8"]],
  ["ocean-jellyfish", "ocean", "scene", "jellyfish-shape", "海里有个软软的东西，像小伞一样漂着，是哪个？", "Which soft sea creature drifts like a little umbrella?", ["1FABC"], ["1F991", "1F420", "1FAB8", "1F980"]],
  ["ocean-crab", "ocean", "dual", "crab-clues", "哪个有大钳子，还常常横着走？", "Which one has big claws and often walks sideways?", ["1F980"], ["1F990", "1F419", "1F420", "1FABC"]],
  ["ocean-dolphin", "ocean", "cause", "dolphin-breathing", "哪个在海里游，却要常到水面呼吸空气？", "Which one swims in the sea but must surface to breathe air?", ["1F42C"], ["1F420", "1F988", "1F419", "1F991"]],
  ["ocean-whale", "ocean", "scene", "whale-spout", "在海上看到巨大动物浮到水面喷水气，应该找哪个？", "Which huge sea animal may surface with a visible spout?", ["1F433"], ["1F420", "1F988", "1F419", "1F990"]],
  ["ocean-shark", "ocean", "dual", "shark-clues", "哪个像鱼一样游，还有一口尖尖的牙？", "Which one swims like a fish and has a mouth full of sharp teeth?", ["1F988"], ["1F420", "1FABC", "1FAB8", "1F991"]],
  ["ocean-coral", "ocean", "relation", "coral-stays-put", "哪个住在海底，像彩色枝条一样，不会游来游去？", "Which one stays on the seafloor like colorful branches instead of swimming around?", ["1FAB8"], ["1F420", "1F991", "1FABC", "1F42C"]],
  ["ocean-not-animal", "ocean", "exclusion", "ocean-exclusion", "海豚、鲨鱼、轮船里，哪个不是动物？", "Dolphin, shark, ship: which one is not an animal?", ["1F6A2"], ["1F42C", "1F988"]],

  ["produce-banana", "produce", "dual", "banana-clues", "哪个是水果，而且弯弯的、要剥皮吃？", "Which fruit is curved and needs peeling?", ["1F34C"], ["1F34E", "1F955", "1F33D", "1F353"]],
  ["produce-grapes", "produce", "dual", "grape-clues", "哪个是水果，而且是一串串的小圆果？", "Which fruit grows in bunches of small round fruits?", ["1F347"], ["1F34E", "1F34C", "1F966", "1F954"]],
  ["produce-grapes-2", "produce", "dual", "grape-clues", "找一个小圆果一串串长着的水果。", "Find the fruit made of many small round fruits growing in a bunch.", ["1F347"], ["1F34E", "1F34C", "1F966", "1F954"]],
  ["produce-pineapple", "produce", "dual", "pineapple-clues", "哪个水果头顶像有叶子王冠，外皮还扎扎的？", "Which fruit has a leafy crown and a prickly outside?", ["1F34D"], ["1F349", "1F353", "1F34E", "1F955"]],
  ["produce-watermelon", "produce", "scene", "watermelon-cut", "夏天切开水果，外面绿色、里面常常红红的，选哪个？", "Which summer fruit is green outside and often red inside when cut?", ["1F349"], ["1F34E", "1F34D", "1F966", "1F954"]],
  ["produce-tomato", "produce", "function", "tomato-sauce", "想做番茄酱，最应该找哪个？", "Which one would you choose to make tomato sauce?", ["1F345"], ["1F353", "1F34E", "1F955", "1F34C"]],
  ["produce-broccoli", "produce", "classification", "broccoli-shape", "哪个是蔬菜，而且看起来像一棵小树？", "Which vegetable looks like a little tree?", ["1F966"], ["1F955", "1F347", "1F33D", "1F954"]],
  ["produce-corn", "produce", "relation", "corn-kernels", "剥开以后，会看到一排排黄色小颗粒的是哪个？", "Which one has rows of little yellow kernels when you open it?", ["1F33D"], ["1F34C", "1F966", "1F954", "1F346"]],
  ["produce-odd-one", "produce", "exclusion", "produce-exclusion", "苹果、香蕉、胡萝卜里，哪个和另外两个不是一类？", "Apple, banana, carrot: which one is in a different group?", ["1F955"], ["1F34E", "1F34C"]],

  ["food-milk", "food", "relation", "milk-source", "哪种饮料来自奶牛，而且可以直接喝？", "Which drink comes from cows and can be drunk?", ["1F95B"], ["1F9C3", "1F366", "1F355", "1F36A"]],
  ["food-milk-2", "food", "relation", "milk-source", "哪杯饮料和奶牛最有关系？", "Which drink is most closely connected with cows?", ["1F95B"], ["1F9C3", "1F366", "1F355", "1F36A"]],
  ["food-ice-cream", "food", "dual", "ice-cream-clues", "哪个又冰凉、又是甜甜的点心？", "Which one is both frozen and sweet?", ["1F366"], ["1F355", "1F35F", "1F354", "1F36A"]],
  ["food-noodles", "food", "dual", "noodle-clues", "哪个长长一条条，常常用筷子夹着吃？", "Which food comes in long strands and is often eaten with chopsticks?", ["1F35C"], ["1F363", "1F355", "1F354", "1F32F"]],
  ["food-pizza", "food", "relation", "pizza-slices", "哪个常常是圆圆一大张，再切成三角形小块？", "Which food is often a big round pie cut into triangle slices?", ["1F355"], ["1F36A", "1F354", "1F35F", "1F96A"]],
  ["food-burger", "food", "dual", "burger-layers", "哪个上下是圆面包，中间还夹着很多馅？", "Which one has round buns on top and bottom with fillings in the middle?", ["1F354"], ["1F96A", "1F32F", "1F32D", "1F355"]],
  ["food-juice-box", "food", "scene", "juice-box-trip", "出门口渴了，想拿一盒带吸管的果汁，选哪个？", "Which one would you take for a boxed juice drink with a straw?", ["1F9C3"], ["1F95B", "1F355", "1F36A", "1F35F"]],
  ["food-cookie", "food", "dual", "cookie-clues", "哪个是小小的甜点，烤好后常常脆脆的？", "Which one is a small sweet treat that is often crisp after baking?", ["1F36A"], ["1F35F", "1F366", "1F355", "1F32D"]],
  ["food-not-drink", "food", "exclusion", "food-exclusion", "牛奶、果汁盒、薯条里，哪个不能当饮料喝？", "Milk, juice box, fries: which one is not a drink?", ["1F35F"], ["1F95B", "1F9C3"]],

  ["transport-train", "transport", "relation", "train-rails", "想沿着铁轨去远方，应该找哪个？", "Which one should you choose to travel along railway tracks?", ["1F682"], ["1F697", "1F68C", "1F6B2", "1F681"]],
  ["transport-bike", "transport", "dual", "bike-clues", "哪个有两个轮子，而且要踩脚踏板前进？", "Which one has two wheels and moves when you pedal?", ["1F6B2"], ["1F3CD", "1F6F4", "1F697", "1F68C"]],
  ["transport-bike-2", "transport", "dual", "bike-clues", "不用发动机，踩脚踏板让两个轮子前进，选哪个？", "Which two-wheeled vehicle moves by pedaling instead of using an engine?", ["1F6B2"], ["1F3CD", "1F6F4", "1F697", "1F68C"]],
  ["transport-tractor", "transport", "scene", "tractor-farm", "在农田里干活、拉农具，最常看到哪种车？", "Which vehicle is commonly used in fields to pull farm equipment?", ["1F69C"], ["1F69A", "1F697", "1F68C", "1F682"]],
  ["transport-bus", "transport", "function", "bus-passengers", "很多人要一起坐车去学校或城市里，应该选哪个？", "Which vehicle is made to carry many people together around town or to school?", ["1F68C"], ["1F695", "1F697", "1F69A", "1F6B2"]],
  ["transport-helicopter", "transport", "dual", "helicopter-clues", "哪个能飞，而且头顶有大大的旋转桨？", "Which one can fly and has a large spinning rotor on top?", ["1F681"], ["2708", "1F697", "1F6A2", "1FA81"]],
  ["transport-taxi", "transport", "scene", "taxi-ride", "在路边招手，付钱请车送你去一个地方，常找哪个？", "Which vehicle do you often hail and pay for a ride to a place?", ["1F695"], ["1F697", "1F68C", "1F69A", "1F682"]],
  ["transport-scooter", "transport", "dual", "scooter-clues", "哪个要站在窄窄的踏板上，还要两手扶着车把？", "Which one has you stand on a narrow deck while holding handlebars?", ["1F6F4"], ["1F6B2", "1F3CD", "1F697", "1F69C"]],
  ["transport-motorcycle", "transport", "dual", "motorcycle-clues", "哪个有两个轮子，又有发动机，骑的时候要跨坐上去？", "Which one has two wheels and an engine and is ridden astride?", ["1F3CD"], ["1F6B2", "1F6F4", "1F697", "1F69C"]],

  ["nature-rainbow", "nature", "cause", "rainbow-after-rain", "下过雨以后，天空里可能出现什么？", "What may appear in the sky after rain?", ["1F308"], ["2601", "2744", "1F30A", "1F319"]],
  ["nature-rainbow-2", "nature", "cause", "rainbow-after-rain", "雨停以后抬头看，天空里可能有哪条七彩弧线？", "After the rain stops, which colorful arc might you see in the sky?", ["1F308"], ["2601", "2744", "1F30A", "1F319"]],
  ["nature-sun", "nature", "cause", "sun-daylight", "白天变得亮亮的，天空里最重要的是哪个？", "Which one in the sky is most responsible for making daytime bright?", ["2600"], ["1F319", "2601", "1F308", "2744"]],
  ["nature-moon", "nature", "scene", "moon-night", "晚上抬头看天空，哪个常常弯弯地发亮？", "Which one often looks curved and bright in the night sky?", ["1F319"], ["2600", "2601", "1F308", "2744"]],
  ["nature-snowflake", "nature", "dual", "snowflake-clues", "天气很冷时，哪个会从天空落下，而且是冰晶？", "Which one can fall from the sky in cold weather and is made of ice crystals?", ["2744"], ["1F4A7", "2601", "1F308", "1F30A"]],
  ["nature-volcano", "nature", "cause", "volcano-lava", "火山喷发时，岩浆会从哪个地方出来？", "Where does lava come out during an eruption?", ["1F30B"], ["1F333", "1F335", "2601", "1F30A"]],
  ["nature-cactus", "nature", "dual", "cactus-clues", "哪个植物常住在干燥地方，身上还有很多刺？", "Which plant often lives in dry places and has lots of spines?", ["1F335"], ["1F333", "1F33C", "1F344", "1F966"]],
  ["nature-cloud", "nature", "cause", "cloud-rain", "天空里聚成一团，还可能带来雨的是哪个？", "Which one gathers in the sky and may bring rain?", ["2601"], ["1F319", "1F308", "2744", "1F4A7"]],
  ["nature-tree", "nature", "function", "tree-shade", "夏天太阳很晒，想找一大片树荫，应该靠近哪个？", "Which one would you go near for a large patch of shade on a sunny day?", ["1F333"], ["1F33C", "1F344", "1F335", "1F4A1"]],

  ["home-bed", "home", "scene", "bed-sleep", "晚上要睡觉了，应该找哪个？", "Which one should you find when it is time to sleep at night?", ["1F6CF"], ["1FA91", "1F6C1", "1F3E0", "1F392"]],
  ["home-key", "home", "function", "key-door", "想把门锁打开，哪个东西最有帮助？", "Which thing is most useful for unlocking a door?", ["1F511"], ["1F4A1", "1F392", "1F45F", "1F9E2"]],
  ["home-key-2", "home", "function", "key-door", "门锁着了，拿哪个东西最容易把它打开？", "The door is locked. Which thing would most likely open it?", ["1F511"], ["1F4A1", "1F392", "1F45F", "1F9E2"]],
  ["home-light", "home", "cause", "light-room", "房间黑黑的，想让它亮起来，要找哪个？", "Which one would help make a dark room bright?", ["1F4A1"], ["1F511", "1FA91", "1F6CF", "2600"]],
  ["home-bathtub", "home", "scene", "bathtub-wash", "想装一大盆水，坐进去洗澡，应该找哪个？", "Which one can hold water so you can sit in it for a bath?", ["1F6C1"], ["1FA91", "1F6CF", "1F3E0", "1F392"]],
  ["home-chair", "home", "function", "chair-sit", "吃饭时想坐下来，哪个最适合让人坐着？", "Which one is made for sitting down at mealtime?", ["1FA91"], ["1F6CF", "1F6C1", "1F392", "1F3E0"]],
  ["home-shoe", "home", "dual", "shoe-feet", "哪个穿在脚上，还能保护脚走路？", "Which one is worn on your feet and protects them while walking?", ["1F45F"], ["1F455", "1F456", "1F9E2", "1F392"]],
  ["home-house", "home", "relation", "house-key", "钥匙最常和什么地方一起用？", "Which place is a key most commonly used with?", ["1F3E0"], ["1FA91", "1F6CF", "1F6C1", "1F392"]],
  ["home-not-clothes", "home", "exclusion", "home-exclusion", "T恤、牛仔裤、书包里，哪个不是穿在身上的衣服？", "T-shirt, jeans, backpack: which one is not clothing you wear?", ["1F392"], ["1F455", "1F456"]],

  ["play-soccer", "play", "function", "soccer-kick", "想踢着玩，应该选哪种球？", "Which ball should you choose if you want to kick it around?", ["26BD"], ["1F3C0", "1F3BE", "1F9E9", "1FA80"]],
  ["play-kite", "play", "cause", "kite-wind", "有风的时候，哪个玩具更容易飞起来？", "Which toy is easier to fly when the wind is blowing?", ["1FA81"], ["1FA80", "1F9F8", "1F9E9", "1F381"]],
  ["play-kite-2", "play", "cause", "kite-wind", "风吹起来了，哪个玩具会借着风往天上飞？", "When the wind picks up, which toy can ride it up into the sky?", ["1FA81"], ["1FA80", "1F9F8", "1F9E9", "1F381"]],
  ["play-drum", "play", "relation", "drum-sticks", "鼓棒应该去找哪个？", "Which instrument goes with drumsticks?", ["1F941"], ["1F3B8", "1F3B9", "1F3A4", "1F9E9"]],
  ["play-gift", "play", "scene", "gift-birthday", "去参加生日会，想带一个包好准备送人的东西，选哪个？", "Which wrapped item would you take to give someone at a birthday party?", ["1F381"], ["1F9F8", "1FA80", "1F9E9", "1F3C0"]],
  ["play-guitar", "play", "dual", "guitar-strings", "哪个乐器有琴弦，还常常抱在怀里弹？", "Which instrument has strings and is often held against you while playing?", ["1F3B8"], ["1F3B9", "1F941", "1F3A4", "1FA80"]],
  ["play-piano", "play", "function", "piano-keys", "想用手指按一排黑白琴键，应该找哪个？", "Which one do you play by pressing rows of black and white keys?", ["1F3B9"], ["1F3B8", "1F941", "1F3A4", "1F9E9"]],
  ["play-microphone", "play", "function", "microphone-sing", "唱歌时想把声音放大，最需要哪个？", "Which one helps make your voice louder when you sing?", ["1F3A4"], ["1F3B8", "1F3B9", "1F941", "1FA80"]],
  ["play-not-ball", "play", "exclusion", "play-exclusion", "篮球、网球、拼图里，哪个不是球？", "Basketball, tennis ball, puzzle: which one is not a ball?", ["1F9E9"], ["1F3C0", "1F3BE"]],
].map(([id, theme, type, concept, zh, en, answers, distractors]) => ({
  id,
  theme,
  type,
  concept,
  labels: { zh, en },
  answers,
  distractors,
}));

// Reviewed, obviously unrelated options used only to make mixed mode cross theme boundaries.
// Exclusion questions keep their exact named trio and do not use these extras.
const GAME_MIXED_DISTRACTORS = {
  animals: ["1F34E", "1FA91"],
  ocean: ["1F34E", "1FA91"],
  produce: ["1F436", "1FA91"],
  food: ["1F436", "1FA91"],
  transport: ["1F34E", "1F36A"],
  nature: ["1F697", "1F355"],
  home: ["1F34E", "1F355"],
  play: ["1F34E", "1FA91"],
};

const GAME_PRAISE = [
  { zh: "找到了！", en: "You found it!" },
  { zh: "答对啦！", en: "That's right!" },
  { zh: "真棒！", en: "Great job!" },
];

const FALLBACK_DATA = {
  en: [
    { hexcode: "1F34E", label: "red apple", tags: ["apple", "fruit"], group: 4, unicode: "🍎" },
    { hexcode: "1F436", label: "dog face", tags: ["pet"], group: 3, unicode: "🐶" },
    { hexcode: "1F431", label: "cat face", tags: ["pet"], group: 3, unicode: "🐱" },
    { hexcode: "1F43B", label: "bear", tags: ["teddy"], group: 3, unicode: "🐻" },
    { hexcode: "1F98B", label: "butterfly", tags: ["insect"], group: 3, unicode: "🦋" },
    { hexcode: "1F33C", label: "blossom", tags: ["flower"], group: 3, unicode: "🌼" },
    { hexcode: "1F349", label: "watermelon", tags: ["fruit", "food"], group: 4, unicode: "🍉" },
    { hexcode: "1F34C", label: "banana", tags: ["fruit", "food"], group: 4, unicode: "🍌" },
    { hexcode: "1F353", label: "strawberry", tags: ["fruit", "food"], group: 4, unicode: "🍓" },
    { hexcode: "1F95B", label: "glass of milk", tags: ["drink", "dairy"], group: 4, unicode: "🥛" },
    { hexcode: "1F964", label: "cup with straw", tags: ["cup", "drink", "water"], group: 4, unicode: "🥤" },
    { hexcode: "1F355", label: "pizza", tags: ["food"], group: 4, unicode: "🍕" },
    { hexcode: "1F354", label: "hamburger", tags: ["food"], group: 4, unicode: "🍔" },
    { hexcode: "1F36A", label: "cookie", tags: ["food", "snack"], group: 4, unicode: "🍪" },
    { hexcode: "1F4A7", label: "droplet", tags: ["water"], group: 3, unicode: "💧" },
    { hexcode: "2600", label: "sun", tags: ["weather"], group: 3, unicode: "☀️" },
    { hexcode: "1F319", label: "crescent moon", tags: ["night", "space"], group: 3, unicode: "🌙" },
    { hexcode: "1F697", label: "automobile", tags: ["car", "vehicle"], group: 5, unicode: "🚗" },
    { hexcode: "1F68C", label: "bus", tags: ["vehicle"], group: 5, unicode: "🚌" },
    { hexcode: "1F3E0", label: "house", tags: ["home"], group: 5, unicode: "🏠" },
    { hexcode: "1F3C0", label: "basketball", tags: ["ball", "sport"], group: 6, unicode: "🏀" },
    { hexcode: "26BD", label: "soccer ball", tags: ["football", "sport"], group: 6, unicode: "⚽" },
    { hexcode: "1F381", label: "wrapped gift", tags: ["present"], group: 7, unicode: "🎁" },
    { hexcode: "1F9F8", label: "teddy bear", tags: ["toy"], group: 7, unicode: "🧸" },
  ],
  zh: [
    { hexcode: "1F34E", label: "红苹果", tags: ["苹果", "水果"], group: 4, unicode: "🍎" },
    { hexcode: "1F436", label: "狗脸", tags: ["宠物", "狗"], group: 3, unicode: "🐶" },
    { hexcode: "1F431", label: "猫脸", tags: ["宠物", "猫"], group: 3, unicode: "🐱" },
    { hexcode: "1F43B", label: "熊", tags: ["玩具熊"], group: 3, unicode: "🐻" },
    { hexcode: "1F98B", label: "蝴蝶", tags: ["昆虫"], group: 3, unicode: "🦋" },
    { hexcode: "1F33C", label: "开花", tags: ["花"], group: 3, unicode: "🌼" },
    { hexcode: "1F349", label: "西瓜", tags: ["水果", "食物"], group: 4, unicode: "🍉" },
    { hexcode: "1F34C", label: "香蕉", tags: ["水果", "食物"], group: 4, unicode: "🍌" },
    { hexcode: "1F353", label: "草莓", tags: ["水果", "食物"], group: 4, unicode: "🍓" },
    { hexcode: "1F95B", label: "一杯奶", tags: ["喝", "牛奶", "饮料"], group: 4, unicode: "🥛" },
    { hexcode: "1F964", label: "带吸管杯", tags: ["杯", "水", "饮料"], group: 4, unicode: "🥤" },
    { hexcode: "1F355", label: "披萨", tags: ["食物"], group: 4, unicode: "🍕" },
    { hexcode: "1F354", label: "汉堡", tags: ["食物"], group: 4, unicode: "🍔" },
    { hexcode: "1F36A", label: "饼干", tags: ["食物", "零食"], group: 4, unicode: "🍪" },
    { hexcode: "1F4A7", label: "水滴", tags: ["水"], group: 3, unicode: "💧" },
    { hexcode: "2600", label: "太阳", tags: ["天气"], group: 3, unicode: "☀️" },
    { hexcode: "1F319", label: "弯月", tags: ["夜晚", "月亮"], group: 3, unicode: "🌙" },
    { hexcode: "1F697", label: "汽车", tags: ["车", "交通工具"], group: 5, unicode: "🚗" },
    { hexcode: "1F68C", label: "公交车", tags: ["车", "交通工具"], group: 5, unicode: "🚌" },
    { hexcode: "1F3E0", label: "房子", tags: ["家"], group: 5, unicode: "🏠" },
    { hexcode: "1F3C0", label: "篮球", tags: ["球", "运动"], group: 6, unicode: "🏀" },
    { hexcode: "26BD", label: "足球", tags: ["球", "运动"], group: 6, unicode: "⚽" },
    { hexcode: "1F381", label: "礼物", tags: ["生日", "包装"], group: 7, unicode: "🎁" },
    { hexcode: "1F9F8", label: "泰迪熊", tags: ["玩具", "熊"], group: 7, unicode: "🧸" },
  ],
};

const dom = {
  heroTapArea: document.querySelector("#heroTapArea"),
  heroEmoji: document.querySelector("#heroEmoji"),
  heroYoutubeLink: document.querySelector("#heroYoutubeLink"),
  heroWordings: document.querySelector("#heroWordings"),
  appCard: document.querySelector(".app-card"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsBackdrop: document.querySelector("#settingsBackdrop"),
  settingsCloseButton: document.querySelector("#settingsCloseButton"),
  topbarLanguageLabel: document.querySelector("#topbarLanguageLabel"),
  speechNote: document.querySelector("#speechNote"),
  activeLanguageSummary: document.querySelector("#activeLanguageSummary"),
  languagePicker: document.querySelector(".language-picker"),
  searchInput: document.querySelector("#searchInput"),
  clearSearchButton: document.querySelector("#clearSearchButton"),
  categoryRow: document.querySelector("#categoryRow"),
  emojiGrid: document.querySelector("#emojiGrid"),
  gridLoading: document.querySelector("#gridLoading"),
  learnPanel: document.querySelector(".learn-panel"),
  explorePanel: document.querySelector(".explore-panel"),
  startGameButton: document.querySelector("#startGameButton"),
  gamePanel: document.querySelector("#gamePanel"),
  gameBackButton: document.querySelector("#gameBackButton"),
  gameLanguagePicker: document.querySelector("#gameLanguagePicker"),
  gameThemeSelect: document.querySelector("#gameThemeSelect"),
  gameModePicker: document.querySelector("#gameModePicker"),
  gameQuestion: document.querySelector("#gameQuestion"),
  gameReplayButton: document.querySelector("#gameReplayButton"),
  gameOptions: document.querySelector("#gameOptions"),
  gameFeedback: document.querySelector("#gameFeedback"),
  gameSpeechNote: document.querySelector("#gameSpeechNote"),
};

const state = {
  datasets: { en: [], zh: [] },
  byHexcode: { en: new Map(), zh: new Map() },
  records: [],
  activeLanguages: ["zh", "en"],
  selectedHexcode: "1F34E",
  category: "all",
  query: "",
  speechRun: 0,
  speechTimer: null,
  utterance: null,
  voices: [],
  isSpeaking: false,
  usingFallback: false,
};

const game = {
  active: false,
  language: "zh",
  theme: "mixed",
  mode: "name",
  pools: {},
  questionPools: {},
  deck: [],
  question: null,
  prompt: null,
  options: [],
  mistakes: 0,
  locked: false,
  feedback: null,
  run: 0,
  timers: [],
  praiseIndex: 0,
  homeScrollY: 0,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’']/g, "")
    .replace(/[\s·,，、/()（）_\-]+/g, " ")
    .trim();
}

function collapseRepeats(value) {
  const chars = Array.from(value);
  return chars.reduce((result, char) => {
    const isCjkCharacter = /[\u3400-\u9fff]/u.test(char);
    return isCjkCharacter && result.endsWith(char) ? result : result + char;
  }, "");
}

function compactText(value) {
  return normalizeText(value).replace(/\s+/g, "");
}

function isCjk(value) {
  return /[\u3400-\u9fff]/u.test(value);
}

function getAllSearchText(item) {
  return [
    item.labels.zh,
    item.labels.en,
    ...item.tags.zh,
    ...item.tags.en,
  ].filter(Boolean).map(normalizeText).join(" ");
}

function isSkinToneRelated(item) {
  return String(item.hexcode).split("-").some((part) => SKIN_TONE_CODES.has(part.toUpperCase()));
}

function prepareDataset(dataset) {
  return dataset.flatMap((item) => {
    const { skins, ...base } = item;
    return [base, ...(Array.isArray(skins) ? skins : [])];
  }).filter((item) => !isSkinToneRelated(item));
}

function mergeDatasets() {
  const englishDataset = prepareDataset(state.datasets.en);
  const chineseDataset = prepareDataset(state.datasets.zh);
  state.byHexcode.en = new Map(englishDataset.map((item) => [item.hexcode, item]));
  state.byHexcode.zh = new Map(chineseDataset.map((item) => [item.hexcode, item]));

  const hexcodes = new Set([...state.byHexcode.en.keys(), ...state.byHexcode.zh.keys()]);
  state.records = [...hexcodes]
    .map((hexcode) => {
      const en = state.byHexcode.en.get(hexcode);
      const zh = state.byHexcode.zh.get(hexcode);
      const source = en || zh;
      const item = {
        hexcode,
        emoji: source?.unicode || source?.emoji || "❔",
        group: source?.group ?? zh?.group ?? 8,
        order: source?.order ?? zh?.order ?? Number.MAX_SAFE_INTEGER,
        labels: {
          en: en?.label || zh?.label || "emoji",
          zh: zh?.label || en?.label || "Emoji",
        },
        tags: {
          en: en?.tags || [],
          zh: zh?.tags || [],
        },
      };
      item.searchText = getAllSearchText(item);
      item.compactSearchText = compactText(item.searchText);
      return item;
    })
    .filter((item) => item.emoji);

  if (!state.records.some((item) => item.hexcode === state.selectedHexcode)) {
    state.selectedHexcode = state.records[0]?.hexcode || "1F34E";
  }
}

function featuredScore(item) {
  const index = FEATURED_HEXCODES.indexOf(item.hexcode);
  return index === -1 ? FEATURED_HEXCODES.length + 1 : index;
}

function sortForDisplay(items) {
  return [...items].sort((a, b) => {
    const featuredDifference = featuredScore(a) - featuredScore(b);
    if (featuredDifference !== 0) return featuredDifference;
    return (a.order || Number.MAX_SAFE_INTEGER) - (b.order || Number.MAX_SAFE_INTEGER);
  });
}

function categoryMatches(item) {
  if (state.category === "all") return true;
  return GROUPS[state.category]?.has(item.group) || false;
}

function fuzzyScore(item, rawQuery) {
  const query = normalizeText(rawQuery);
  if (!query) return 0;

  const queryWithoutRepeats = collapseRepeats(query);
  const queryCompact = queryWithoutRepeats.replace(/\s+/g, "");
  const search = item.searchText;
  const searchCompact = item.compactSearchText;
  const fields = [item.labels.zh, item.labels.en, ...item.tags.zh, ...item.tags.en].map(compactText);
  const labels = [item.labels.zh, item.labels.en].map(compactText);
  let score = 0;

  if (search.includes(query)) score = Math.max(score, 54);
  if (searchCompact.includes(queryCompact)) score = Math.max(score, 67);
  if (fields.includes(queryCompact)) score = Math.max(score, 122);
  if (fields.some((field) => field.startsWith(queryCompact))) score = Math.max(score, 105);
  if (labels.includes(queryCompact)) score = Math.max(score, 125);
  if (labels.some((label) => label.startsWith(queryCompact))) score = Math.max(score, 108);

  const tokens = query.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    const tokenHits = tokens.filter((token) => search.includes(token)).length;
    score = Math.max(score, 62 + (tokenHits / tokens.length) * 35);
  }

  if (queryCompact.length > 0 && isCjk(queryCompact)) {
    const uniqueQueryChars = [...new Set(Array.from(queryCompact))];
    const hitCount = uniqueQueryChars.filter((char) => searchCompact.includes(char)).length;
    if (hitCount === uniqueQueryChars.length) score = Math.max(score, 81 + Math.min(queryCompact.length, 8));
    else if (hitCount > 0) score = Math.max(score, 42 + (hitCount / uniqueQueryChars.length) * 20);
  }

  if (score === 0 && queryCompact.length >= 3) {
    let cursor = 0;
    for (const char of queryCompact) {
      const foundAt = searchCompact.indexOf(char, cursor);
      if (foundAt === -1) break;
      cursor = foundAt + 1;
      score += 5;
    }
    if (score < queryCompact.length * 5) score = 0;
  }

  return score;
}

function getVisibleRecords() {
  let records = state.records.filter(categoryMatches);
  const query = state.query.trim();

  if (!query) {
    return sortForDisplay(records);
  }

  const scoredRecords = records
    .map((item) => ({ item, score: fuzzyScore(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || featuredScore(a.item) - featuredScore(b.item) || a.item.order - b.item.order);
  const strongMatches = scoredRecords.some(({ score }) => score >= 80)
    ? scoredRecords.filter(({ score }) => score >= 80)
    : scoredRecords;

  return strongMatches
    .slice(0, 5)
    .map(({ item }) => item);
}

function getCurrentRecord() {
  return state.records.find((item) => item.hexcode === state.selectedHexcode) || state.records[0];
}

function activeLanguageText() {
  return state.activeLanguages.map((language) => LANGUAGES[language].label).join(" · ");
}

function activeLanguageShortText() {
  return state.activeLanguages.map((language) => language === "zh" ? "中" : "EN").join(" / ");
}

function selectedLabels(item) {
  return state.activeLanguages.map((language) => item?.labels[language]).filter(Boolean);
}

function renderHero() {
  const item = getCurrentRecord();
  if (!item) return;

  dom.heroEmoji.textContent = item.emoji;
  dom.heroTapArea.setAttribute("aria-label", `点击朗读 ${selectedLabels(item).join(" / ")}`);
  dom.heroYoutubeLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(item.labels.en)}`;
  dom.heroYoutubeLink.setAttribute("aria-label", `在 YouTube 搜索 ${item.labels.en}`);
  dom.heroWordings.innerHTML = state.activeLanguages.map((language) => {
    const label = item.labels[language];
    return `<span class="hero-word" lang="${language === "zh" ? "zh-CN" : "en-US"}">${escapeHtml(label)} <small>${escapeHtml(LANGUAGES[language].label)}</small></span>`;
  }).join("");
  dom.activeLanguageSummary.textContent = activeLanguageText();
  dom.topbarLanguageLabel.textContent = activeLanguageShortText();
}

function renderLanguagePicker() {
  dom.languagePicker.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = state.activeLanguages.includes(button.dataset.language);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderCategories() {
  dom.categoryRow.querySelectorAll("[data-category]").forEach((button) => {
    const isActive = state.category === button.dataset.category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function cardLabelMarkup(item) {
  return state.activeLanguages.map((language) => {
    const labelClass = language === "en" ? "card-label card-label-en" : "card-label";
    return `<span class="${labelClass}" lang="${language === "zh" ? "zh-CN" : "en-US"}">${escapeHtml(item.labels[language])}</span>`;
  }).join("");
}

function renderGrid() {
  const records = getVisibleRecords();
  dom.clearSearchButton.hidden = !dom.searchInput.value;
  dom.emojiGrid.setAttribute("aria-busy", "false");

  if (!records.length) {
    dom.emojiGrid.innerHTML = "";
    return;
  }

  dom.emojiGrid.innerHTML = records.map((item) => {
    const selected = item.hexcode === state.selectedHexcode ? " is-selected" : "";
    const ariaLabel = selectedLabels(item).join(" / ");
    return `<button class="emoji-card${selected}" type="button" data-hexcode="${escapeHtml(item.hexcode)}" aria-label="点击朗读 ${escapeHtml(ariaLabel)}">
      <span class="card-emoji" aria-hidden="true">${escapeHtml(item.emoji)}</span>
      <span class="card-labels">${cardLabelMarkup(item)}</span>
    </button>`;
  }).join("");
}

function setNotice(message) {
  dom.speechNote.textContent = message;
}

function setSettingsOpen(isOpen) {
  dom.settingsBackdrop.hidden = !isOpen;
  dom.settingsButton.setAttribute("aria-expanded", String(isOpen));
}

function updateSelectedCard(previousHexcode, selectedHexcode) {
  if (previousHexcode) {
    dom.emojiGrid.querySelector(`[data-hexcode="${previousHexcode}"]`)?.classList.remove("is-selected");
  }
  dom.emojiGrid.querySelector(`[data-hexcode="${selectedHexcode}"]`)?.classList.add("is-selected");
}

function selectEmoji(hexcode, shouldSpeak = true) {
  const item = state.records.find((record) => record.hexcode === hexcode);
  if (!item) return;
  const previousHexcode = state.selectedHexcode;
  state.selectedHexcode = hexcode;
  renderHero();
  updateSelectedCard(previousHexcode, hexcode);
  if (shouldSpeak) speakCurrent();
}

function getVoice(language) {
  const locale = LANGUAGES[language].voice.toLowerCase();
  const languageCode = locale.split("-")[0];
  const matchingVoices = state.voices.filter((voice) => {
    const voiceLanguage = voice.lang?.toLowerCase() || "";
    return voiceLanguage === locale || voiceLanguage.startsWith(languageCode);
  });

  if (!matchingVoices.length) return null;

  return [...matchingVoices].sort((first, second) => {
    const score = (voice) => {
      const name = `${voice.name} ${voice.lang}`;
      const normalizedName = name.toLowerCase();
      let value = voice.lang?.toLowerCase() === locale ? 80 : 0;
      VOICE_PREFERENCES[language].forEach((pattern, index) => {
        if (pattern.test(name)) value += 30 - index * 4;
      });
      if (voice.localService === false) value += 18;
      if (/desktop|compact/i.test(normalizedName)) value -= 10;
      if (language === "zh" && /中国大陆|mainland|simplified/i.test(normalizedName)) value += 12;
      return value;
    };
    return score(second) - score(first);
  })[0];
}

function refreshVoices() {
  try {
    state.voices = window.speechSynthesis?.getVoices() || [];
  } catch {
    state.voices = [];
  }
}

function cancelSpeech() {
  // Invalidate callbacks before cancel(), which can emit events synchronously.
  state.speechRun += 1;
  window.clearTimeout(state.speechTimer);
  state.speechTimer = null;
  state.utterance = null;
  state.isSpeaking = false;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // Reading and playing remain available when the speech service fails.
  }
}

function speakLabels(labels, { languages = state.activeLanguages, onStart = () => {}, onComplete = () => {}, onError = () => {} } = {}) {
  cancelSpeech();
  const run = state.speechRun;
  const languagesToSpeak = languages.filter((language) => labels[language]);
  let currentIndex = 0;
  let finished = false;

  const finish = (error) => {
    if (run !== state.speechRun || finished) return;
    finished = true;
    window.clearTimeout(state.speechTimer);
    state.speechTimer = null;
    state.isSpeaking = false;
    state.utterance = null;
    if (error) {
      cancelSpeech();
      onError(error);
    } else {
      onComplete();
    }
  };

  const speakNext = () => {
    if (run !== state.speechRun || finished) return;
    if (currentIndex >= languagesToSpeak.length) {
      finish();
      return;
    }

    const language = languagesToSpeak[currentIndex++];
    try {
      const utterance = new window.SpeechSynthesisUtterance(labels[language]);
      utterance.lang = LANGUAGES[language].voice;
      utterance.rate = language === "zh" ? 0.92 : 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = getVoice(language);
      if (voice) utterance.voice = voice;
      let settled = false;
      utterance.onend = () => {
        if (settled || run !== state.speechRun || finished) return;
        settled = true;
        speakNext();
      };
      utterance.onerror = (event) => {
        if (settled || run !== state.speechRun || finished) return;
        settled = true;
        finish(event.error || "failed");
      };
      state.utterance = utterance;
      onStart(labels[language]);
      window.speechSynthesis.speak(utterance);
    } catch {
      finish("failed");
    }
  };

  if (!window.speechSynthesis || !("SpeechSynthesisUtterance" in window)) {
    finish("unavailable");
    return;
  }
  refreshVoices();
  state.isSpeaking = true;
  state.speechTimer = window.setTimeout(() => finish("timeout"), 10000);
  try {
    window.speechSynthesis.resume();
    speakNext();
  } catch {
    finish("failed");
  }
}

function speakCurrent() {
  const item = getCurrentRecord();
  if (!item || game.active) return;
  speakLabels(item.labels, {
    onStart: (label) => setNotice(`正在读：${label}`),
    onComplete: () => setNotice("再点一下，就会再读一遍。 "),
    onError: (error) => setNotice(error === "unavailable"
      ? "这个浏览器暂时不支持朗读，可以换 Safari 或 Chrome 试试。 "
      : "朗读没有成功，再点一下试试。 "),
  });
}

function prepareGamePools() {
  const available = new Map(state.records.map((item) => [item.hexcode, item]));
  const words = GAME_WORDS.filter((word) => {
    const item = available.get(word.hexcode);
    return item?.emoji && item.emoji !== "❔";
  }).map((word) => ({ ...word, emoji: available.get(word.hexcode).emoji }));
  const byHexcode = new Map(words.map((word) => [word.hexcode, word]));
  const questions = GAME_QUESTIONS.map((question) => ({
    ...question,
    answers: question.answers.map((hexcode) => byHexcode.get(hexcode)).filter(Boolean),
    distractors: [...new Set([
      ...question.distractors,
      ...(question.type === "exclusion" ? [] : (GAME_MIXED_DISTRACTORS[question.theme] || [])),
    ])]
      .filter((hexcode) => !question.answers.includes(hexcode))
      .map((hexcode) => byHexcode.get(hexcode)).filter(Boolean),
  })).filter((question) => question.answers.length && question.distractors.length >= 2);
  ["mixed", ...GAME_THEMES].forEach((theme) => {
    game.pools[theme] = words.filter((word) => theme === "mixed" || word.theme === theme);
    game.questionPools[theme] = questions.filter((question) => theme === "mixed" || question.theme === theme);
  });
  dom.startGameButton.disabled = !gameThemeAvailable("mixed", "name");
  renderGameControls();
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function gameLanguageMarkup(labels, className) {
  return `<span class="${className}" lang="${LANGUAGES[game.language].voice}">${escapeHtml(labels[game.language])}</span>`;
}

function renderGameFeedback() {
  dom.gameFeedback.innerHTML = game.feedback ? gameLanguageMarkup(game.feedback, "game-feedback-line") : "";
  dom.gameFeedback.classList.toggle("is-success", game.locked);
}

function renderGameText() {
  dom.gameLanguagePicker.querySelectorAll('input[name="game-language"]').forEach((input) => {
    input.checked = input.value === game.language;
  });
  dom.gameQuestion.innerHTML = gameLanguageMarkup(gameQuestionLabels(), "game-question-line");
  dom.gameOptions.querySelectorAll("[data-game-hexcode]").forEach((button) => {
    const word = game.options.find((option) => option.hexcode === button.dataset.gameHexcode);
    button.setAttribute("aria-label", word.labels[game.language]);
    button.lang = LANGUAGES[game.language].voice;
  });
  renderGameFeedback();
}

function gameThemeAvailable(theme, mode = game.mode) {
  if (!game.pools[theme] || game.pools[theme].length < 3) return false;
  return mode === "name" || (mode === "think" && game.questionPools[theme].length > 0);
}

function renderGameControls() {
  Array.from(dom.gameThemeSelect.options).forEach((option) => {
    option.disabled = !gameThemeAvailable(option.value);
  });
  dom.gameThemeSelect.value = game.theme;
  dom.gameThemeSelect.disabled = !gameThemeAvailable("mixed");
  dom.gameModePicker.querySelectorAll('input[name="game-mode"]').forEach((input) => {
    input.checked = input.value === game.mode;
    input.disabled = !gameThemeAvailable(game.theme, input.value);
  });
}

function cancelGameActivity() {
  game.run += 1;
  game.timers.forEach((timer) => window.clearTimeout(timer));
  game.timers = [];
  cancelSpeech();
}

function playGameFeedbackTone(isCorrect) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(isCorrect ? 520 : 240, now);
    oscillator.frequency.exponentialRampToValueAtTime(isCorrect ? 780 : 170, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
    oscillator.onended = () => context.close().catch(() => {});
  } catch {
    // Keep the game playable when Web Audio is unavailable.
  }
}

function speakGame(labels, onComplete = () => {}) {
  const run = game.run;
  dom.gameSpeechNote.hidden = true;
  speakLabels(labels, {
    languages: [game.language],
    onComplete: () => {
      if (game.active && run === game.run) onComplete();
    },
    onError: () => {
      if (!game.active || run !== game.run) return;
      dom.gameSpeechNote.textContent = {
        zh: "暂时没有声音，家长可以读题，继续点选哦。",
        en: "No sound right now. A grown-up can read the question.",
      }[game.language];
      dom.gameSpeechNote.lang = LANGUAGES[game.language].voice;
      dom.gameSpeechNote.hidden = false;
      onComplete();
    },
  });
}

function gameQuestionLabels() {
  if (game.prompt) return game.prompt.labels;
  return {
    zh: `${game.question.labels.zh}在哪里？`,
    en: `Find the ${game.question.labels.en}!`,
  };
}

function gameValuesCanFollow(entries, previousValue, getValue) {
  if (game.mode !== "think" || !entries.length) return true;
  const counts = new Map();
  entries.forEach((entry) => {
    const value = getValue(entry);
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  const sameValueLimit = Math.floor(entries.length / 2);
  const otherValueLimit = Math.ceil(entries.length / 2);
  return Array.from(counts).every(([value, count]) => (
    count <= (value === previousValue ? sameValueLimit : otherValueLimit)
  ));
}

function takeNextGameEntry(pool) {
  if (!game.deck.length) game.deck = shuffled(pool);

  if (game.mode !== "think") {
    const index = game.deck.findIndex((entry) => entry.hexcode !== game.question?.hexcode);
    return game.deck.splice(index >= 0 ? index : 0, 1)[0];
  }

  const previousAnswer = game.question?.hexcode;
  const previousType = game.prompt?.type;
  const previousConcept = game.prompt?.concept;
  const answerRepeats = (entry) => entry.answers.some((word) => word.hexcode === previousAnswer);
  const typeRepeats = (entry) => entry.type === previousType;
  const conceptRepeats = (entry) => entry.concept === previousConcept;

  let index = game.deck.findIndex((entry, entryIndex) => (
    !answerRepeats(entry)
    && !typeRepeats(entry)
    && !conceptRepeats(entry)
    && gameValuesCanFollow(
      game.deck.filter((_, index) => index !== entryIndex),
      entry.answers[0]?.hexcode,
      (next) => next.answers[0]?.hexcode,
    )
    && gameValuesCanFollow(
      game.deck.filter((_, index) => index !== entryIndex),
      entry.type,
      (next) => next.type,
    )
    && gameValuesCanFollow(
      game.deck.filter((_, index) => index !== entryIndex),
      entry.concept,
      (next) => next.concept,
    )
  ));
  if (index < 0) index = game.deck.findIndex((entry) => (
    !answerRepeats(entry) && !typeRepeats(entry) && !conceptRepeats(entry)
  ));
  if (index < 0) index = game.deck.findIndex((entry) => !answerRepeats(entry) && !conceptRepeats(entry));
  if (index < 0) index = game.deck.findIndex((entry) => !answerRepeats(entry));
  if (index < 0) index = 0;
  return game.deck.splice(index, 1)[0];
}

function nextGameQuestion() {
  if (!game.active || !gameThemeAvailable(game.theme)) return;
  const pool = game.mode === "think" ? game.questionPools[game.theme] : game.pools[game.theme];
  cancelGameActivity();
  const entry = takeNextGameEntry(pool);
  game.prompt = game.mode === "think" ? entry : null;
  game.question = game.prompt ? shuffled(game.prompt.answers)[0] : entry;
  const sameThemeDistractors = game.prompt
    ? shuffled(game.prompt.distractors.filter((word) => word.theme === game.prompt.theme))
    : [];
  const crossThemeDistractors = game.prompt
    ? shuffled(game.prompt.distractors.filter((word) => word.theme !== game.prompt.theme))
    : [];
  const candidates = game.prompt
    ? (game.theme === "mixed"
      ? [...crossThemeDistractors, ...sameThemeDistractors]
      : [...sameThemeDistractors, ...crossThemeDistractors])
    : shuffled(pool.filter((word) => word.hexcode !== game.question.hexcode));
  const distractors = candidates.slice(0, 2);
  game.options = shuffled([game.question, ...distractors]);
  game.mistakes = 0;
  game.locked = false;
  game.feedback = null;
  dom.gameOptions.innerHTML = game.options.map((word) =>
    `<button class="game-option" type="button" data-game-hexcode="${word.hexcode}">
      <span class="game-option-emoji" aria-hidden="true">${escapeHtml(word.emoji)}</span>
    </button>`
  ).join("");
  renderGameText();
  speakGame(gameQuestionLabels());
}

function enterGame() {
  if (game.active || !gameThemeAvailable(game.theme)) return;
  game.homeScrollY = window.scrollY;
  game.active = true;
  setSettingsOpen(false);
  dom.learnPanel.hidden = true;
  dom.explorePanel.hidden = true;
  dom.gamePanel.hidden = false;
  renderGameControls();
  nextGameQuestion();
  window.scrollTo(0, 0);
  dom.gameReplayButton.focus({ preventScroll: true });
}

function exitGame() {
  if (!game.active) return;
  game.active = false;
  cancelGameActivity();
  dom.gamePanel.hidden = true;
  dom.learnPanel.hidden = false;
  dom.explorePanel.hidden = false;
  setNotice("点这里听发音");
  dom.startGameButton.focus({ preventScroll: true });
  window.scrollTo(0, game.homeScrollY);
}

function changeGameTheme(theme) {
  if (!game.active || theme === game.theme || !gameThemeAvailable(theme)) return;
  game.theme = theme;
  game.deck = [];
  renderGameControls();
  nextGameQuestion();
}

function changeGameMode(mode) {
  if (!game.active || mode === game.mode || !gameThemeAvailable(game.theme, mode)) return;
  game.mode = mode;
  game.deck = [];
  renderGameControls();
  nextGameQuestion();
}

function changeGameLanguage(language) {
  if (!game.active || language === game.language || !["zh", "en"].includes(language)) return;
  cancelGameActivity();
  game.language = language;
  renderGameText();
  if (game.locked) {
    continueGameAfterSpeech((done) => speakGame(game.feedback, done));
  } else {
    speakGame(gameQuestionLabels());
  }
}

function continueGameAfterSpeech(speak) {
  const run = game.run;
  let minimumElapsed = false;
  let speechFinished = false;
  const advance = () => {
    if (game.active && game.locked && run === game.run) nextGameQuestion();
  };
  // Missing speech can finish synchronously, so schedule the minimum first.
  // speakLabels' timeout handles a stalled voice without cutting off normal praise.
  game.timers = [
    window.setTimeout(() => {
      minimumElapsed = true;
      if (speechFinished) advance();
    }, 1200),
  ];
  speak(() => {
    speechFinished = true;
    if (minimumElapsed) advance();
  });
}

function replayGameQuestion() {
  if (!game.active || !game.question) return;
  cancelGameActivity();
  if (game.locked) {
    // Replaying during praise keeps the answer locked and replaces its timers.
    continueGameAfterSpeech((done) => speakGame(gameQuestionLabels(), done));
  } else {
    speakGame(gameQuestionLabels());
  }
}

function answerGame(hexcode) {
  if (!game.active || game.locked || !game.options.some((word) => word.hexcode === hexcode)) return;
  if (hexcode !== game.question.hexcode) {
    game.mistakes += 1;
    const selected = game.options.find((word) => word.hexcode === hexcode);
    const retry = { zh: "再想想", en: "Try again!" };
    const spokenRetry = {
      zh: `再想想。你选的是${selected.labels.zh}。`,
      en: `Try again. You chose ${selected.labels.en}.`,
    };
    game.feedback = retry;
    renderGameFeedback();
    if (game.mistakes === 2) {
      dom.gameOptions.querySelector(`[data-game-hexcode="${game.question.hexcode}"]`).classList.add("is-hint");
    }
    playGameFeedbackTone(false);
    speakGame(spokenRetry);
    return;
  }

  // Lock before any speech or animation can dispatch another event.
  game.locked = true;
  cancelGameActivity();
  dom.gameOptions.querySelectorAll(".game-option").forEach((button) => {
    button.disabled = true;
    button.classList.remove("is-hint");
  });
  const selected = dom.gameOptions.querySelector(`[data-game-hexcode="${hexcode}"]`);
  selected.classList.add("is-correct");
  selected.insertAdjacentHTML("beforeend", '<span class="game-stars" aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></span>');
  const praise = GAME_PRAISE[game.praiseIndex++ % GAME_PRAISE.length];
  game.feedback = praise;
  renderGameFeedback();
  playGameFeedbackTone(true);
  continueGameAfterSpeech((done) => speakGame(praise, done));
}

async function loadDatasets() {
  if (window.EMOJI_DATA?.en?.length && window.EMOJI_DATA?.zh?.length) {
    state.datasets.en = window.EMOJI_DATA.en;
    state.datasets.zh = window.EMOJI_DATA.zh;
    mergeDatasets();
    return;
  }

  try {
    const [enResponse, zhResponse] = await Promise.all([
      fetch("data/en.json"),
      fetch("data/zh.json"),
    ]);
    if (!enResponse.ok || !zhResponse.ok) throw new Error("Emoji data was not found");
    state.datasets.en = await enResponse.json();
    state.datasets.zh = await zhResponse.json();
  } catch (error) {
    state.datasets = FALLBACK_DATA;
    state.usingFallback = true;
    console.warn("Full Emoji data could not be loaded; using the built-in starter set.", error);
  }
  mergeDatasets();
}

function bindEvents() {
  dom.startGameButton.addEventListener("click", enterGame);
  dom.gameBackButton.addEventListener("click", exitGame);
  dom.gameReplayButton.addEventListener("click", replayGameQuestion);
  dom.gameLanguagePicker.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="game-language"]');
    if (input?.checked) changeGameLanguage(input.value);
  });
  dom.gameThemeSelect.addEventListener("change", () => {
    changeGameTheme(dom.gameThemeSelect.value);
  });
  dom.gameModePicker.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="game-mode"]');
    if (input?.checked && !input.disabled) changeGameMode(input.value);
  });
  dom.gameOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-hexcode]");
    if (button && !button.disabled) answerGame(button.dataset.gameHexcode);
  });

  dom.heroTapArea.addEventListener("click", () => speakCurrent());
  dom.heroTapArea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    speakCurrent();
  });

  dom.settingsButton.addEventListener("click", () => {
    setSettingsOpen(dom.settingsBackdrop.hidden);
  });

  dom.settingsCloseButton.addEventListener("click", () => setSettingsOpen(false));
  dom.settingsBackdrop.addEventListener("click", (event) => {
    if (event.target === dom.settingsBackdrop) setSettingsOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (game.active) exitGame();
    setSettingsOpen(false);
  });

  dom.languagePicker.addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (!button) return;
    const language = button.dataset.language;
    if (state.activeLanguages.includes(language)) {
      if (state.activeLanguages.length === 1) {
        setNotice("至少保留一种朗读语言哦。 ");
        return;
      }
      state.activeLanguages = state.activeLanguages.filter((item) => item !== language);
    } else {
      state.activeLanguages.push(language);
    }
    cancelSpeech();
    renderLanguagePicker();
    renderHero();
    renderGrid();
    setNotice(`已选择：${activeLanguageText()}。点上方听发音。 `);
  });

  dom.categoryRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderGrid();
  });

  dom.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderGrid();
  });

  dom.clearSearchButton.addEventListener("click", () => {
    state.query = "";
    dom.searchInput.value = "";
    dom.searchInput.focus();
    renderGrid();
  });

  dom.emojiGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-hexcode]");
    if (!card) return;
    selectEmoji(card.dataset.hexcode);
  });
}

function bindInteractionGuards() {
  const preventDefault = (event) => event.preventDefault();
  const preventZoomShortcut = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    const isZoomKey = ["+", "=", "-", "_", "0"].includes(event.key)
      || ["NumpadAdd", "NumpadSubtract"].includes(event.code);
    if (isZoomKey) event.preventDefault();
  };

  dom.appCard.addEventListener("contextmenu", preventDefault);
  dom.appCard.addEventListener("dragstart", preventDefault);
  dom.appCard.addEventListener("selectstart", preventDefault);
  dom.appCard.addEventListener("dblclick", preventDefault);

  document.addEventListener("keydown", preventZoomShortcut);
  document.addEventListener("wheel", (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  }, { passive: false });
  document.addEventListener("touchmove", (event) => {
    if (event.touches.length > 1) event.preventDefault();
  }, { passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
    document.addEventListener(eventName, preventDefault, { passive: false });
  });
}

async function init() {
  bindInteractionGuards();
  bindEvents();
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  }
  await loadDatasets();
  dom.gridLoading?.remove();
  renderLanguagePicker();
  renderCategories();
  renderHero();
  renderGrid();
  prepareGamePools();
  if (state.usingFallback) {
    setNotice("完整词库加载失败，当前使用内置词汇；请检查 data 文件是否完整。 ");
  }
}

init();
