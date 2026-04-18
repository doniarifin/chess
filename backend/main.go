package main

import (
	"chess-engine/api"
	"chess-engine/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	gm := service.NewGameManager()
	h := api.NewHandler(gm)

	// origins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
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
