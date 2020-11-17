describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'CypressMan',
      username: 'cypress',
      password: 'cypress'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3001')
  })

  it('login form is shown', function () {
    cy.get('#username').should('not.have.css', 'display', 'none')
    cy.get('#password').should('not.have.css', 'display', 'none')
    cy.get('#login-button').should('not.have.css', 'display', 'none')
  })

  describe('login', function () {
    it('login succeeds with correct credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('cypress')
      cy.get('#login-button').click()

      cy.contains('CypressMan logged in')
    })

    it('login fails with incorrect credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'incorrect credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'CypressMan logged in')
    })

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'cypress', password: 'cypress' })
      })

      it('a blog can be created', function () {
        cy.contains('create a new blog').click()

        cy.get('#title').type('cypress testing')
        cy.get('#author').type('cypress')
        cy.get('#url').type('cypress')

        cy.get('#submit-button').click()

        cy.contains('cypress testing, cypress')
      })

      describe('with a single blog', function () {
        beforeEach(function () {
          cy.createBlog({ title: 'cypress testing', author: 'cypress', url: 'cypress' })
        })

        it('blog can be liked', function() {
          cy.contains('show...').click()
          cy.contains('like').click()

          cy.get('.details').should('contain', 'Likes 1')
        })

        it('blog can be deleted by its creator', function () {
          cy.contains('cypress testing, cypress')
            .contains('show...').click()

          cy.contains('delete blog').click()

          cy.get('html').should('not.contain', 'cypress testing, cypress')

        })

        it('blog cannot be deleted by its creator', function() {
          cy.contains('logout').click()
          
          const user = {
            name: 'WrongDude',
            username: 'wrong',
            password: 'wrong'
          }
          cy.request('POST', 'http://localhost:3001/api/users', user)

          cy.login({ username: 'wrong', password: 'wrong'})

          cy.contains('show...').click()

          cy.get('html').should('not.contain', 'delete blog')
        })
      })

      describe('with multiple blogs', function() {
        beforeEach(function() {
          cy.createBlog({ title: 'first', author: 'first', url: 'first' })
          cy.createBlog({ title: 'second', author: 'second', url: 'second' })
          cy.createBlog({ title: 'third', author: 'third', url: 'third' })

        })

        it('blogs are ordered by amount of likes', function() {
          cy.request('GET', 'http://localhost:3001/api/blogs')
            .then(response => {
              let i = 1
              response.body.forEach(blog => {
                blog.likes = i
                console.log(blog)
                i++
                cy.addLikes({ id: blog.id, updatedBlog: blog}) 
              });
            })


          cy.visit('http://localhost:3001')
          cy.wait(1000)

          cy.contains('create a new blog').parent().parent().next()
            .should('contain', 'third, third').next()
            .should('contain', 'second, second').next()
            .should('contain', 'first, first')
        })
      })
    })
  })
})