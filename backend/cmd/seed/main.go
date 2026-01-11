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
