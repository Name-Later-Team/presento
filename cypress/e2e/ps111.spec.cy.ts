describe("PS111", () => {
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
        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").click();
        cy.get(".css-ovfnxs").click();
        cy.get("#react-select-4-option-1").click();

        cy.get("#indicator").should("contain", "Đã lưu");
        cy.reload();
        cy.get(".css-ovfnxs").should("contain", "Tiêu đề");

        /* ==== End Cypress Studio ==== */
    });

    it("TC002", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").click();
        cy.get(".css-ovfnxs").click();
        cy.get("#react-select-4-option-2").click();

        cy.get("#indicator").should("contain", "Đã lưu");
        cy.reload();
        cy.get(".css-ovfnxs").should("contain", "Đoạn văn");

        /* ==== End Cypress Studio ==== */
    });
    it("TC003", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get("tbody > :nth-child(1) > :nth-child(2) > a").click();
        cy.get(".css-ovfnxs").click();
        cy.get("#react-select-4-option-0").click();

        cy.get("#indicator").should("contain", "Đã lưu");
        cy.reload();
        cy.get(".css-ovfnxs").should("contain", "Multiple Choice");

        /* ==== End Cypress Studio ==== */
    });
    const mockChoice=[
        "Lựa chọn 2",
        "2",
        "212123123",
        "!@#$%^&*()_+",
        " Lua Chon 2  ",
        "Lua!@Chon5!@"
    ]
    mockChoice.forEach(choice=>{
        it("TC006", () => {
            /* ==== Generated with Cypress Studio ==== */
            cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
            cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();
            cy.get(':nth-child(3) > .btn-primary').click();
            cy.get(':nth-child(3) > .w-100 > .d-flex > .form-control').type(choice);
            cy.get('.edit-presentation__col--left').click();
            cy.get("#indicator").should("contain", "Đã lưu");

            cy.reload();
            cy.get(':nth-child(3) > .w-100 > .d-flex > .form-control').should('have.value',choice);
        });
    })
    it("TC007", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
        cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();
        cy.get(':nth-child(3) > .btn-primary').click();
        cy.get(':nth-child(3) > .w-100 > .d-flex > .form-control').type("Lua chon 2");
        cy.get('.edit-presentation__col--left').click();
        cy.get("#indicator").should("contain", "Đã lưu");

        cy.reload();
        cy.get(':nth-child(3) > .w-100 > .d-flex > .form-control').should('have.value',"Lua chon 2");
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(3) > .w-100 > .d-flex > .text-danger > .svg-inline--fa').click();
        cy.get("#indicator").should("contain", "Đã lưu");

        cy.reload();
        cy.wait(5000);
        cy.get(':nth-child(3) > .w-100 > .d-flex > .form-control').should("not.exist");

        /* ==== End Cypress Studio ==== */
    });
    it("TC010", () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
        cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();

        /* ==== Generated with Cypress Studio ==== */

        /* ==== Generated with Cypress Studio ==== */
        cy.get("[role='presentation']").eq(1).click();
        cy.get('#showInstructionBar').uncheck();
        cy.get('#instruction-bar__vote-link').should("not.exist");
        /* ==== End Cypress Studio ==== */
    });

});
