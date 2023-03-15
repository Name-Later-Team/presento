const failUser = require("../fixtures/FailUser.json");

describe("Login", () => {
    beforeEach(() => {
      Cypress.session.clearCurrentSessionData()

        cy.visit("/login");
    });
    it("loginPass", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(".btn-primary").click();
        cy.get("#input").type("huudanh2802");
        cy.get("#normal_login_password").clear();
        cy.get("#normal_login_password").type("28022001");
        cy.get(".ant-btn").click();
        cy.get(".ant-btn").should("not.exist");

        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.mb-3 > div > .btn').click();
        cy.get('.static-header__menu-btn > .svg-inline--fa > path').click();
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.mb-3 > div > .btn').click();
        cy.get('.static-header__menu-btn > .svg-inline--fa > path').click();
        /* ==== End Cypress Studio ==== */
    });

    /* ==== Generated with Cypress Studio ==== */
    failUser.forEach((user) => {
        it("loginFail", () => {
            cy.get(".btn-primary").click();
            cy.log(user.username + " " + user.password);
            cy.get("#input").clear();
            cy.get("#input").type(user.username);
            cy.get("#normal_login_password").clear();
            cy.get("#normal_login_password").type(user.password);
            cy.get(".ant-btn").click();
            cy.get(".ant-btn").should("exist");
          });
    });

    /* ==== End Cypress Studio ==== */
});
