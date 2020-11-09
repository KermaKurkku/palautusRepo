const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => (
	blogs.reduce((sum, blog) => {
		return sum + blog.likes
	}, 0)
)

const favoriteBlog = (blogs) => (
	blogs.reduce((highest, blog) => {
		return highest.likes > blog.likes
			? highest
			: blog
	},[])
)

const mostBlogs = (blogs) => {
	let mostBlogs = blogs
		.reduce((list, blog) => {
			let authorIndex = list.findIndex((most) => {
				return most.author === blog.author
			})
			if (authorIndex === -1)
			{
				list.push({
					author: blog.author,
					blogs: 1
				})
			} else
			{
				list[authorIndex].blogs += 1
			}
			return list
		}, [])
		.sort((a,b) => b.blogs - a.blogs)
	return mostBlogs[0]
}

const mostLikes = (blogs) => {
	let mostLikes = blogs
		.reduce((list, blog) => {
			let authorIndex = list.findIndex((most) => {
				return most.author === blog.author
			})
			if (authorIndex === -1)
			{
				list.push({
					author: blog.author,
					likes: blog.likes
				})
			} else
			{
				list[authorIndex].likes += blog.likes
			}
			return list
		}, [])
		.sort((a,b) => b.likes - a.likes)
	return mostLikes[0]
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}