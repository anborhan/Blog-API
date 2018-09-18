const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("BlogPosts", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

it('should list blog posts on GET', function() {
    return chai.request(app)
      	.get('/blog-posts')
     	.then(function(res) {
        	expect(res).to.have.status(200);
	        expect(res).to.be.json;
	        expect(res.body).to.be.a('array');
	        expect(res.body.length).to.be.above(0);
	        res.body.forEach(function(item) {
	        expect(item).to.be.a('object');
	        expect(item).to.have.all.keys(
	        	'title', 'content', 'author', 'id', 'publishDate');
        });
    });
});

it("should add a blog post on POST", function() {
    const newItem = { title: "Blog Post Test", content: "this is a test post", author: "Mr. Tester",
		publishDate: Date.now()};
    return chai
      .request(app)
      .post("/blog-posts")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("title", "content", "author", "publishDate");
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

it("should update blog posts on PUT", function() {
	const updateData = {
	  title: "Test Blog Post",
	  content: "This is a test",
	  author: "Mr. Tester"
	};

	return (
	  chai
	    .request(app)
	    .get("/blog-posts")
	    .then(function(res) {
	      updateData.id = res.body[0].id;
	      return chai
	        .request(app)
	        .put(`/blog-posts/${updateData.id}`)
	        .send(updateData);
	    })
	    // prove that the PUT request has right status code
	    // and returns updated item
	    .then(function(res) {
	      expect(res).to.have.status(204);
	    })
	);
});

it("should delete blog posts on DELETE", function() {
return (
    chai
	    .request(app)
	    // first have to get so we have an `id` of item
	    // to delete
	    .get("/blog-posts")
	    .then(function(res) {
	      return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
	    })
	    .then(function(res) {
		      expect(res).to.have.status(204);
		    })
	);
	});
});