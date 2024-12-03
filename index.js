import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./db.js";

const resolvers = {
  Query: {
    games() {
      return db.games
    },
    game(_, args) {
      return db.games.find(game => game.id ===  args.id)
    },
    reviews() {
      return db.reviews
    },
    review(_, args) {
      return db.reviews.find(review => review.id ===  args.id)
    },
    authors() {
      return db.authors
    },
    author(_, args) {
      return db.authors.find(author => author.id ===  args.id)
    }
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter(review => review.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter(review => review.author_id === parent.id)
    }
  },
  Review: {
    game(parent) {
      return db.games.find(game => game.id === parent.game_id)
    },
    author(parent) {
      return db.authors.find(author => author.id === parent.author_id)
    }
  },
  Mutation: {
    createReview(_, args) {
      const review = {
        id: (db.reviews.length + 1).toString(),
        ...args.input
      }
      db.reviews.push(review)
      return review
    },
    deleteReview(_, args) {
      const review = db.reviews.find(review => review.id === args.id)
      db.reviews = db.reviews.filter(review => review.id !== args.id)
      return review
    },
    updateReview(_, args) {
      const review = db.reviews.find(review => review.id === args.id)
      review.rating = args.input.rating
      review.content = args.input.content
      return review
    }
  }
}

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers 
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`🚀 Server ready at: ${url}`)