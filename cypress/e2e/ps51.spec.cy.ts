describe("PS51", () => {
    beforeEach(() => {
        Cypress.session.clearCurrentSessionData();

        cy.visit("/login");
        cy.get(".btn-primary").click();
        cy.get("#input").type("huudanh2802");
        cy.get("#normal_login_password").clear();
        cy.get("#normal_login_password").type("28022001");
        cy.get(".ant-btn").click();
        cy.get(".ant-btn").should("not.exist");
    });
    const testData = [
        "cWl58m9XuB",
        "Bài trình bày 1",
        "2",
        "Bài trình bày",
        "@##!@$$#",
        "Bài trình bày 1 @34$%52",
        "Select * from *",
    ];
    testData.forEach((data) => {
        it("TC001", () => {
            cy.log(data);
            /* ==== Generated with Cypress Studio ==== */
            cy.get(".mb-3 > :nth-child(1) > .btn > .svg-inline--fa").click();
            cy.get("form").click();
            cy.get(".form-control").click();
            cy.get(".form-control").clear();
            cy.get(".form-control").type(data);
            cy.get(".justify-content-end > .btn-primary").click();
            cy.get("tbody > :nth-child(1) > :nth-child(2) > a").should("contain", data.trim());
            /* ==== End Cypress Studio ==== */
        });
    });

    it("TC002", () => {
        cy.get(".mb-3 > :nth-child(1) > .btn > .svg-inline--fa").click();
        cy.get("form").click();
        cy.get(".form-control").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type("     ");
        cy.get(".justify-content-end > .btn-primary").click();

        /* ==== Generated with Cypress Studio ==== */
        cy.get(".mb-3 > .text-danger").should("contain", "Tên bài trình bày không được bỏ trống");
        /* ==== End Cypress Studio ==== */
    });
    it("TC003", () => {
        cy.get(".mb-3 > :nth-child(1) > .btn > .svg-inline--fa").click();
        cy.get("form").click();
        cy.get(".form-control").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type("8rTMN0lHWo9iXKSsVrUig4lXB10PiWTqC938yGnvdl5sbeDQpUGuAruzbgA5qGtOUtxL7aO8Vvrlkyd6yUfRYEEXoDZfEjQ8TIom1");
        cy.get(".justify-content-end > .btn-primary").click();

        /* ==== Generated with Cypress Studio ==== */
        /* ==== End Cypress Studio ==== */
        cy.get(".Toastify").should("contain","Có lỗi xảy ra khi gửi yêu cầu tạo bài trình bày mới");
    });
    it("TC004", () => {
        cy.get(".mb-3 > :nth-child(1) > .btn > .svg-inline--fa").click();
        cy.get("form").click();
        cy.get(".form-control").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type("      Bài trình bày 1     ");
        cy.get(".justify-content-end > .btn-primary").click();
        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").should("contain", "Bài trình bày 1");
    });
});
