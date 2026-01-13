package main

import (
	"errors"
	"io"
	"log"

	"github.com/jeffreylim24/GameHub/database"
	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/utils"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type seedPost struct {
	TopicID     uint
	AuthorID    *uint
	Title       string
	Content     string
	Category    string
	Platform    string
	HasSpoilers bool
	Comments    []seedComment
}

type seedComment struct {
	AuthorID    *uint
	Content     string
	HasSpoilers bool
}

func main() {
	log.Println("Loading environment variables...")
	utils.LoadEnv()

	log.Println("Connecting to database...")
	db := database.Connect()

	log.Println("Running migrations...")
	database.Migrate(db, &models.User{}, &models.Topic{}, &models.Post{}, &models.Comment{})

	log.Println("Seeding sample data...")
	if err := seed(db); err != nil {
		log.Fatalf("Seeding failed: %v", err)
	}

	log.Println("Seeding complete.")
}

func seed(db *gorm.DB) error {
	seedDB := db.Session(&gorm.Session{
		Logger: logger.New(log.New(io.Discard, "", 0), logger.Config{
			IgnoreRecordNotFoundError: true,
		}),
	})

	alex, err := ensureUser(seedDB, "alex")
	if err != nil {
		return err
	}
	bri, err := ensureUser(seedDB, "bri")
	if err != nil {
		return err
	}
	chen, err := ensureUser(seedDB, "chen")
	if err != nil {
		return err
	}
	dara, err := ensureUser(seedDB, "dara")
	if err != nil {
		return err
	}
	echo, err := ensureUser(seedDB, "echo")
	if err != nil {
		return err
	}
	frost, err := ensureUser(seedDB, "frost")
	if err != nil {
		return err
	}
	ghost, err := ensureUser(seedDB, "ghost")
	if err != nil {
		return err
	}
	hunter, err := ensureUser(seedDB, "hunter")
	if err != nil {
		return err
	}
	ivy, err := ensureUser(seedDB, "ivy")
	if err != nil {
		return err
	}
	jade, err := ensureUser(seedDB, "jade")
	if err != nil {
		return err
	}

	eldenRing, err := ensureTopic(seedDB, "Elden Ring", "Open-world action RPG with brutal bosses and deep buildcrafting.", uintPtr(alex.UserID))
	if err != nil {
		return err
	}
	stardew, err := ensureTopic(seedDB, "Stardew Valley", "Cozy farming sim with surprisingly deep optimization paths.", uintPtr(bri.UserID))
	if err != nil {
		return err
	}
	hades2, err := ensureTopic(seedDB, "Hades II", "Fast-paced roguelike with tight combat and layered narrative.", uintPtr(chen.UserID))
	if err != nil {
		return err
	}
	celeste, err := ensureTopic(seedDB, "Celeste", "Challenging platformer with precision movement and heartfelt story about mental health.", uintPtr(echo.UserID))
	if err != nil {
		return err
	}
	minecraft, err := ensureTopic(seedDB, "Minecraft", "Sandbox building game with infinite creativity and survival challenges.", uintPtr(frost.UserID))
	if err != nil {
		return err
	}
	hollowKnight, err := ensureTopic(seedDB, "Hollow Knight", "Beautiful metroidvania with challenging combat and atmospheric exploration.", uintPtr(ghost.UserID))
	if err != nil {
		return err
	}
	terraria, err := ensureTopic(seedDB, "Terraria", "2D sandbox adventure with extensive boss fights and crafting systems.", uintPtr(hunter.UserID))
	if err != nil {
		return err
	}
	valorant, err := ensureTopic(seedDB, "Valorant", "Tactical 5v5 shooter with unique agent abilities and strategic gameplay.", uintPtr(ivy.UserID))
	if err != nil {
		return err
	}
	genshin, err := ensureTopic(seedDB, "Genshin Impact", "Open-world gacha RPG with elemental combat and exploration.", uintPtr(jade.UserID))
	if err != nil {
		return err
	}
	baldursGate3, err := ensureTopic(seedDB, "Baldur's Gate 3", "Epic D&D-based RPG with deep choices and tactical turn-based combat.", uintPtr(alex.UserID))
	if err != nil {
		return err
	}

	posts := []seedPost{
		{
			TopicID:     eldenRing.TopicID,
			AuthorID:    uintPtr(alex.UserID),
			Title:       "Boss strategies for Radahn",
			Content:     "Tried a bleed build and it melted his phase two. Summons help a ton, but watch the meteor dive timing.",
			Category:    "Discussion",
			Platform:    "PC",
			HasSpoilers: true,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Frostbite also stacks nicely if you swap weapons mid-fight.",
					HasSpoilers: true,
				},
				{
					AuthorID:    uintPtr(dara.UserID),
					Content:     "I used the NPC summons plus rot pots and it felt manageable.",
					HasSpoilers: true,
				},
			},
		},
		{
			TopicID:     eldenRing.TopicID,
			AuthorID:    uintPtr(bri.UserID),
			Title:       "Is a pure STR build viable early?",
			Content:     "I want to go unga bunga but early game stamina feels rough. Any weapons to rush?",
			Category:    "Question",
			Platform:    "PlayStation",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "Grab the Greatsword in Caelid if you can survive the run.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Great Club is solid and easy to get without hard bosses.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     stardew.TopicID,
			AuthorID:    uintPtr(dara.UserID),
			Title:       "Year 1 greenhouse rush tips",
			Content:     "Focus on quality crops and bundle timing. Plan days around the Traveling Cart for missing items.",
			Category:    "Tips",
			Platform:    "Nintendo Switch",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(bri.UserID),
					Content:     "Totally agree. Animals slow me down early unless I get sprinklers fast.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     stardew.TopicID,
			AuthorID:    uintPtr(alex.UserID),
			Title:       "Junimo Hut layout showcase",
			Content:     "Sharing a layout that keeps harvest paths clear while covering most of the field with one hut.",
			Category:    "Highlight",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(bri.UserID),
					Content:     "Love this. The diagonal sprinklers make it look so clean.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Do you swap crops seasonally or stick to ancient fruit?",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(dara.UserID),
					Content:     "Nice! I always forget the hut range is a perfect circle.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     hades2.TopicID,
			AuthorID:    uintPtr(chen.UserID),
			Title:       "First impressions after 10 runs",
			Content:     "Combat feels faster than Hades 1. The new cast system makes positioning more interesting.",
			Category:    "Review",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "Agree on the pace. The staff weapon combo feels especially smooth.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(bri.UserID),
					Content:     "I miss the old dash feel a bit, but the new boons are fun.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     celeste.TopicID,
			AuthorID:    uintPtr(echo.UserID),
			Title:       "Just beat Farewell after 3000+ deaths",
			Content:     "This was the hardest thing I've ever completed in gaming. The final screen gauntlet had me shaking. Worth every retry.",
			Category:    "Highlight",
			Platform:    "Nintendo Switch",
			HasSpoilers: true,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(frost.UserID),
					Content:     "Congrats! Farewell is brutal. I'm still stuck on the feather section.",
					HasSpoilers: true,
				},
				{
					AuthorID:    uintPtr(dara.UserID),
					Content:     "That's dedication! Did you use assist mode at all or pure vanilla?",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(echo.UserID),
					Content:     "No assists, wanted the full experience. Took me two weeks!",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     celeste.TopicID,
			AuthorID:    uintPtr(ghost.UserID),
			Title:       "Best level for learning advanced movement?",
			Content:     "I can barely do wavedashes consistently. Which B-side should I practice on to get comfortable with advanced tech?",
			Category:    "Question",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(echo.UserID),
					Content:     "1A and 2A have good intro sections. Also Core B-side forces you to learn it well.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(jade.UserID),
					Content:     "The Summit climb is great for extended wavedash chains once you're comfortable.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     minecraft.TopicID,
			AuthorID:    uintPtr(frost.UserID),
			Title:       "My survival base after 200 hours",
			Content:     "Finally finished my mega base with automatic farms for everything. Iron, gold, food, you name it. Feels good to be self-sufficient.",
			Category:    "Highlight",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(hunter.UserID),
					Content:     "Nice! What's your iron farm design? I'm still using the basic spawner setup.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(frost.UserID),
					Content:     "I went with the zombie villager converter method. Gets about 400 ingots per hour.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(ivy.UserID),
					Content:     "That looks amazing! Did you build this in creative first or just winged it?",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     minecraft.TopicID,
			AuthorID:    uintPtr(bri.UserID),
			Title:       "Tips for finding ancient cities?",
			Content:     "I've explored probably 20 deep dark biomes and still haven't found a single ancient city. Am I missing something?",
			Category:    "Question",
			Platform:    "Xbox",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(frost.UserID),
					Content:     "They spawn under mountain biomes usually. Try using the /locate command to confirm they exist nearby.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Bring night vision potions and lots of wool. Sculk sensors make it really hard to navigate.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     hollowKnight.TopicID,
			AuthorID:    uintPtr(ghost.UserID),
			Title:       "Pantheon 5 clear with all bindings",
			Content:     "After months of practice, I finally did it. Pure Vessel and Absolute Radiance with bindings felt impossible at first but the muscle memory kicks in eventually.",
			Category:    "Highlight",
			Platform:    "PC",
			HasSpoilers: true,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(echo.UserID),
					Content:     "Absolute legend! I can barely do P5 without bindings. What charm build did you use?",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(ghost.UserID),
					Content:     "Strength, Quickslash, Shaman Stone, and Spell Twister. Focused on burst damage windows.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     hollowKnight.TopicID,
			AuthorID:    uintPtr(dara.UserID),
			Title:       "Which charm combo for beginner boss fights?",
			Content:     "I keep dying to Soul Master and I feel like my charm setup isn't helping. What's a good general purpose build?",
			Category:    "Question",
			Platform:    "PlayStation",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(ghost.UserID),
					Content:     "Quick Focus and Shape of Unn make healing way safer. Add Fragile Strength for more damage.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "Soul Catcher helps you cast more spells which is great against Soul Master specifically.",
					HasSpoilers: true,
				},
			},
		},
		{
			TopicID:     terraria.TopicID,
			AuthorID:    uintPtr(hunter.UserID),
			Title:       "Pre-Hardmode base tour",
			Content:     "Set up NPC housing, hellevators, and arena for the Wall. Ready to enter Hardmode with proper prep this time!",
			Category:    "Highlight",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(frost.UserID),
					Content:     "Nice! Did you make any fish farms? The crate fishing before Hardmode can give you great loot.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(hunter.UserID),
					Content:     "Not yet, but that's a great idea. I'll set one up before breaking the altars.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     terraria.TopicID,
			AuthorID:    uintPtr(jade.UserID),
			Title:       "Best class for first playthrough?",
			Content:     "Starting Terraria for the first time and there's so many weapon types. Should I commit to one class or just use whatever I find?",
			Category:    "Question",
			Platform:    "Nintendo Switch",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(hunter.UserID),
					Content:     "Melee is most forgiving for beginners. But honestly just use what feels fun, you can respec later.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "I'd recommend ranged. Bows feel intuitive and you get good options throughout the game.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Summoner is rough early but becomes OP later. Save it for a second run maybe.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     valorant.TopicID,
			AuthorID:    uintPtr(ivy.UserID),
			Title:       "Climbing out of silver tips?",
			Content:     "I'm hardstuck Silver 3 and feel like I'm not improving. My aim is decent but I lose so many rounds to bad positioning. Any advice?",
			Category:    "Question",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(ghost.UserID),
					Content:     "Focus on crosshair placement and playing off your team. Don't ego peek every fight.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(jade.UserID),
					Content:     "Watch VOD reviews of your own games. You'll spot mistakes you don't notice in the moment.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(ivy.UserID),
					Content:     "Good point about VODs. I never record my games but I should start.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     valorant.TopicID,
			AuthorID:    uintPtr(chen.UserID),
			Title:       "Chamber nerfs hit too hard?",
			Content:     "Chamber went from must-pick to basically unplayable in ranked. The TP cooldown nerf makes him feel so clunky now.",
			Category:    "Discussion",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(ivy.UserID),
					Content:     "He needed nerfs but yeah they overdid it. He's not worth picking over Jett or Raze anymore.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(echo.UserID),
					Content:     "I still think he's viable on specific maps like Ascent. Just not the auto-pick he used to be.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     genshin.TopicID,
			AuthorID:    uintPtr(jade.UserID),
			Title:       "F2P Spiral Abyss 12 clear!",
			Content:     "Finally 36-starred Abyss without spending money. National team and Hyperbloom carried me hard. Feels so good!",
			Category:    "Highlight",
			Platform:    "PlayStation",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(bri.UserID),
					Content:     "Congrats! What investment level are your characters? Still working on my supports.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(jade.UserID),
					Content:     "Main DPS at 80/90 with level 8 talents. Supports are mostly 70/80 with level 6 talents.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     genshin.TopicID,
			AuthorID:    uintPtr(frost.UserID),
			Title:       "Best team for new players in 2024?",
			Content:     "Just started last week and the roster is overwhelming. What's a good team I can build toward as a beginner?",
			Category:    "Question",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(jade.UserID),
					Content:     "National team is still king: Bennett, Xiangling, Xingqiu, and any anemo. All are free or easy to get.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(dara.UserID),
					Content:     "Focus on your favorite characters first though. Meta doesn't matter much in overworld content.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     baldursGate3.TopicID,
			AuthorID:    uintPtr(alex.UserID),
			Title:       "Honour mode tips for Act 2",
			Content:     "Made it through Act 1 but Act 2 is way harder. The Moonrise ambush almost ended my run. What strategies helped you survive?",
			Category:    "Discussion",
			Platform:    "PC",
			HasSpoilers: true,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Stock up on invisibility potions and scrolls. They trivialize most encounters if you plan ahead.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(ghost.UserID),
					Content:     "Abuse high ground and choke points. Don't rush into open areas where you can get surrounded.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     baldursGate3.TopicID,
			AuthorID:    uintPtr(echo.UserID),
			Title:       "Most satisfying multiclass build?",
			Content:     "I want to try something different from pure classes. What multiclass combo felt the most fun to play?",
			Category:    "Question",
			Platform:    "PlayStation",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "Paladin/Warlock is amazing. You get smite slots back on short rest and Eldritch Blast for range.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(hunter.UserID),
					Content:     "Fighter/Wizard Eldritch Knight feels great. Action Surge lets you drop huge damage spike rounds.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(ivy.UserID),
					Content:     "Rogue/Ranger with Gloomstalker is nuts for first turn burst damage in combat.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     baldursGate3.TopicID,
			AuthorID:    uintPtr(bri.UserID),
			Title:       "Just finished my first playthrough - what an ending!",
			Content:     "That final choice in Act 3 had me staring at the screen for 10 minutes. The consequences felt so heavy. This game is a masterpiece.",
			Category:    "Review",
			Platform:    "PC",
			HasSpoilers: true,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "Right? The writing in this game is incredible. Which ending did you choose?",
					HasSpoilers: true,
				},
				{
					AuthorID:    uintPtr(dara.UserID),
					Content:     "I'm still in Act 2 but can't wait. Trying to do every side quest before progressing.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     eldenRing.TopicID,
			AuthorID:    uintPtr(hunter.UserID),
			Title:       "DLC weapons worth using in base game?",
			Content:     "Just beat the DLC and got some cool weapons. Are any of them actually better than base game options for PvE?",
			Category:    "Discussion",
			Platform:    "Xbox",
			HasSpoilers: true,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(alex.UserID),
					Content:     "Backhand Blades are amazing for DEX builds. The moveset is so fluid.",
					HasSpoilers: true,
				},
				{
					AuthorID:    uintPtr(ghost.UserID),
					Content:     "Euporia scales insanely well with INT. Best weapon I've used for a mage build.",
					HasSpoilers: true,
				},
			},
		},
		{
			TopicID:     stardew.TopicID,
			AuthorID:    uintPtr(chen.UserID),
			Title:       "Skull Cavern floor 100 without staircases",
			Content:     "Finally did it with just bombs and coffee. Iridium Snake Milk made healing way easier. Took 3 in-game hours.",
			Category:    "Highlight",
			Platform:    "Nintendo Switch",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(bri.UserID),
					Content:     "That's impressive! I always cheese it with staircases. What weapon did you use?",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Galaxy Sword with Crusader enchantment. The extra damage to mummies helps a ton.",
					HasSpoilers: false,
				},
			},
		},
		{
			TopicID:     hades2.TopicID,
			AuthorID:    uintPtr(ivy.UserID),
			Title:       "Axe vs Staff for speedruns?",
			Content:     "Trying to optimize my clear times. Which weapon do you think has better potential for sub-20 minute runs?",
			Category:    "Question",
			Platform:    "PC",
			HasSpoilers: false,
			Comments: []seedComment{
				{
					AuthorID:    uintPtr(chen.UserID),
					Content:     "Staff has higher DPS ceiling but Axe is more consistent. Depends on your boon RNG honestly.",
					HasSpoilers: false,
				},
				{
					AuthorID:    uintPtr(jade.UserID),
					Content:     "Watch some speedrun VODs on YouTube. Most top times use Staff with Zeus boons.",
					HasSpoilers: false,
				},
			},
		},
	}

	for _, postSeed := range posts {
		post, err := ensurePost(seedDB, postSeed)
		if err != nil {
			return err
		}

		for _, commentSeed := range postSeed.Comments {
			if err := ensureComment(seedDB, post.PostID, commentSeed); err != nil {
				return err
			}
		}
	}

	return nil
}

func ensureUser(db *gorm.DB, username string) (models.User, error) {
	var user models.User
	if err := db.Where("username = ?", username).First(&user).Error; err == nil {
		return user, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return user, err
	}

	// Hash the default password "password" for seeded users
	hashedPassword, err := utils.HashPassword("password")
	if err != nil {
		return user, err
	}

	user = models.User{
		Username:     username,
		PasswordHash: hashedPassword,
		Role:         "user",
	}
	return user, db.Create(&user).Error
}

func ensureTopic(db *gorm.DB, title, description string, createdBy *uint) (models.Topic, error) {
	var topic models.Topic
	if err := db.Where("title = ?", title).First(&topic).Error; err == nil {
		return topic, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return topic, err
	}

	topic = models.Topic{
		Title:       title,
		Description: description,
		CreatedBy:   createdBy,
	}
	return topic, db.Create(&topic).Error
}

func ensurePost(db *gorm.DB, post seedPost) (models.Post, error) {
	var existing models.Post
	if err := db.Where("topic_id = ? AND title = ?", post.TopicID, post.Title).First(&existing).Error; err == nil {
		return existing, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return existing, err
	}

	newPost := models.Post{
		TopicID:     post.TopicID,
		AuthorID:    post.AuthorID,
		Title:       post.Title,
		Content:     post.Content,
		Category:    post.Category,
		Platform:    post.Platform,
		HasSpoilers: post.HasSpoilers,
	}
	return newPost, db.Create(&newPost).Error
}

func ensureComment(db *gorm.DB, postID uint, comment seedComment) error {
	var existing models.Comment
	if err := db.Where("post_id = ? AND content = ?", postID, comment.Content).First(&existing).Error; err == nil {
		return nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	newComment := models.Comment{
		PostID:      postID,
		AuthorID:    comment.AuthorID,
		Content:     comment.Content,
		HasSpoilers: comment.HasSpoilers,
	}
	return db.Create(&newComment).Error
}

func uintPtr(value uint) *uint {
	return &value
}
