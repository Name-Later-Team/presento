describe("PS88", () => {
    beforeEach(() => {
        Cypress.session.clearCurrentSessionData();

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
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > :nth-child(1)").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type("Bai trinh bay 4");
        cy.get(".justify-content-end > .btn-primary").click();

        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").should("contain", "Bai trinh bay 4");
    });
    it("TC002", () => {
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > :nth-child(1)").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type("       ");
        cy.get(".justify-content-end > .btn-primary").click();
        cy.get(".mb-3 > .text-danger").should("contain", "Tên bài trình bày không được bỏ trống");
    });
    it("TC003", () => {
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > :nth-child(1)").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type(
            "8rTMN0lHWo9iXKSsVrUig4lXB10PiWTqC938yGnvdl5sbeDQpUGuAruzbgA5qGtOUtxL7aO8Vvrlkyd6yUfRYEEXoDZfEjQ8TIom1"
        );
        cy.get(".justify-content-end > .btn-primary").click();
        cy.get(".Toastify__toast-body").should("contain", "Có lỗi xảy ra khi gửi yêu cầu đổi tên bài trình bày");
        /* ==== End Cypress Studio ==== */
    });
    it("TC004", () => {
        const str = "     Hello     ";
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > :nth-child(1)").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type(str);
        cy.get(".justify-content-end > .btn-primary").click();

        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").should("contain", str.trim());
        /* ==== End Cypress Studio ==== */
    });
    it("TC005", () => {
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > :nth-child(1)").click();
        cy.get(".justify-content-end > .btn-primary").click();
        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").should("contain", "Bai trinh bay 1");
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
    it("TC006", () => {
        cy.log(data);
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .btn").click();
        cy.get(":nth-child(1) > :nth-child(6) > .dropdown > .dropdown-menu > :nth-child(1)").click();
        cy.get(".form-control").clear();
        cy.get(".form-control").type(data);
        cy.get(".justify-content-end > .btn-primary").click();

        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").should("contain", data.trim());
        /* ==== End Cypress Studio ==== */
    });
});
});
