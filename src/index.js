const { GraphQLServer } = require('graphql-yoga')

let links = [{
	id: 'link-0',
	url: 'www.howtographql.com',
	description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
		link: (root, args) => links.map((link, i) => {
			console.log('id : ',args.id)
			console.log('> ',link)
			let result = {}
			if (link.id === `link-${args.id}`) {
				console.log('RETURN : ',links[i])
				result = links[i]
			}
			return result
			// return 'The link is not found'
		})
	},
	Mutation: {
		post: (root, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url
			}
			links.push(link)
			return link
		},
		updateLink: (root, args) => {
			const link = {
				id: args.id,
				description: args.description,
				url: args.url
			}
			links.map((link, i) => {
				if (link.id === args.id) {
					links[i] = link
				}
			})
			return link
		},
		deleteLink: (root, args) => {
			let remove = (array, targetId) => {
				return array.filter(arr => arr.id !== targetId)
			}
			links = remove(links, args.id)
			return links
		}
	},
	/* They are not needed because the GraphQL server infers what they look like */
	// Link: {
	// 	id: (root) => root.id,
	// 	url: (root) => root.url,
	// 	description: (root) => root.description
	// }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
