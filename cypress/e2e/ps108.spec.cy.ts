describe("PS108", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.get(".btn-primary").click();
        cy.get("#input").type("admin");
        cy.get("#normal_login_password").clear();
        cy.get("#normal_login_password").type("123");
        cy.get(".ant-btn").click();
        cy.get(".ant-btn").should("not.exist");
        cy.get(".mb-3 > :nth-child(1) > .btn > .svg-inline--fa").click();
        cy.get("form").click();
        cy.get(".form-control").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type("Bai trinh bay 1");
        cy.get(".justify-content-end > .btn-primary").click();
        cy.get(".Toastify__toast-body").click();
    });
    it("TC001", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > .text-danger").click();
        cy.get(".swal2-confirm").click();
        cy.get(".Toastify__toast-body").should("contain", "Xóa bài trình bày thành công");
        /* ==== End Cypress Studio ==== */
    });

    it("TC002", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > .text-danger").click();
        cy.get(".swal2-cancel").click();
        cy.get(".Toastify__toast-body").should("not.contain","Xóa bài trình bày thành công");
        /* ==== End Cypress Studio ==== */
    });
});
