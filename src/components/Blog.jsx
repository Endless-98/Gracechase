import { Link } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'Our Journey with AI Music',
      date: 'October 8, 2025',
      image: 'images/album-covers/YourMajesty_AlbumCover.png', // Placeholder image
      excerpt: 'Discover how Gracechase blends AI creativity with human emotion to create unique music experiences.',
      content: 'Full content here...'
    },
    {
      id: 2,
      title: 'Behind the Scenes: Creating "Your Majesty"',
      date: 'October 5, 2025',
      image: 'images/site-banners/YMBG.jpg', // Placeholder image
      excerpt: 'A deep dive into the inspiration and production process behind our latest album.',
      content: 'Full content here...'
    }
  ];

  return (
    <div className="blog-page">
      <header className="blog-header">
        <Link to="/" className="home-link">← Back to Home</Link>
        <h1>Blog</h1>
        <p>Insights, stories, and updates from Gracechase</p>
      </header>
      <section className="blog-posts">
        {posts.map(post => (
          <article key={post.id} className="blog-post">
            <img src={post.image} alt={post.title} className="blog-post-image" />
            <h2>{post.title}</h2>
            <p className="post-date">{post.date}</p>
            <p className="post-excerpt">{post.excerpt}</p>
            <a href="#" className="read-more">Read More</a>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Blog;