// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const { update } = require("../../../blogilistaBackend/models/blog")

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3001/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedBlogUser', JSON.stringify(body))
      cy.visit('http://localhost:3001')
    })
  })
  
  Cypress.Commands.add('createBlog', ({ title, author, url }) => {
    cy.request({
      url: 'http://localhost:3001/api/blogs',
      method: 'POST',
      body: { title, author, url },
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
      }
    })
  
    cy.visit('http://localhost:3001')
  })

  Cypress.Commands.add('addLikes', ({ id, updatedBlog }) => {
    cy.request('PUT', `http://localhost:3001/api/blogs/${id}`, updatedBlog)

  })