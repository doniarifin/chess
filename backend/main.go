package main

import (
	"chess-engine/api"
	"chess-engine/service"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	gm := service.NewGameManager()
	h := api.NewHandler(gm)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
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
