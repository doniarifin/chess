package main

import (
	"chess-engine/api"
	"chess-engine/service"
	"fmt"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	r := gin.Default()

	gm := service.NewGameManager()
	h := api.NewHandler(gm)

	// fmt.Println("ALLOWED_ORIGINS =", os.Getenv("ALLOWED_ORIGINS"))

	raw := os.Getenv("ALLOWED_ORIGINS")
	origins := []string{}

	for _, o := range strings.Split(raw, ",") {
		o = strings.TrimSpace(o)
		if o != "" {
			origins = append(origins, o)
		}
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		api.POST("/game", h.CreateGame)
		api.GET("/game/:id", h.GetGame)

		api.POST("/game/:id/move", h.Move)

		api.POST("/game/:id/ai-move", h.AIMove)
	}

	r.Run(":8080")
}
