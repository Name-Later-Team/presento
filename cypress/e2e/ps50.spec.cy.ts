

describe("PS50", () => {
    it("TC001", () => {
        cy.intercept(
            {
              method: 'GET', // Route all GET requests
              url: '/api/presentation/v1/presentations?limit=10&order=%7B%22updatedAt%22%3A%22DESC%22%7D&page=1',
            },
           
            {
                "code": 200,
                "message": "OK",
                "data": {
                    "items": [
                    ],
                    "pagination": {
                        "count": 0,
                        "page": 1,
                        "limit": 10
                    }
                }
            }
        
          ).as('getPresentations')
        cy.visit("/login");
        cy.get(".btn-primary").click();
        cy.get("#input").type("admin");
        cy.get("#normal_login_password").clear();
        cy.get("#normal_login_password").type("123");
        cy.get(".ant-btn").click();
        cy.get(".ant-btn").should("not.exist");


        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-center').should("contain","Không có dữ liệu phù hợp");
        /* ==== End Cypress Studio ==== */
    });
    it("TC002", () => {
        cy.intercept(
            {
              method: 'GET', // Route all GET requests
              url: '/api/presentation/v1/presentations?limit=10&order=%7B%22updatedAt%22%3A%22DESC%22%7D&page=1',
            },
           
            {
                "code": 200,
                "message": "OK",
                "data": {
                    "items": [
                        {
                            "createdAt": "2023-04-19T06:56:58.935Z",
                            "updatedAt": "2023-04-19T17:00:04.375Z",
                            "name": "Bài trình bày 1",
                            "identifier": "48e4f3c3-8776-4a07-89c3-cc648256e88c",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 83,
                                "state": "presenting",
                                "counter": 1
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                    ],
                    "pagination": {
                        "count": 0,
                        "page": 1,
                        "limit": 10
                    }
                }
            }
        
          ).as('getPresentationsAsc')
        cy.visit("/login");
        cy.get(".btn-primary").click();
        cy.get("#input").type("admin");
        cy.get("#normal_login_password").clear();
        cy.get("#normal_login_password").type("123");
        cy.get(".ant-btn").click();
        cy.get(".ant-btn").should("not.exist");



        /* ==== Generated with Cypress Studio ==== */
        cy.get('tr > :nth-child(2) > a').should("contain","Bài trình bày 1");
        /* ==== End Cypress Studio ==== */
    });
    it("TC003", () => {
        cy.intercept(
            {
              method: 'GET', // Route all GET requests
              url: '/api/presentation/v1/presentations?limit=10&order=%7B%22updatedAt%22%3A%22DESC%22%7D&page=1',
            },
            {
                "code": 200,
                "message": "OK",
                "data": {
                    "items": [
                        {
                            "createdAt": "2023-04-19T06:56:58.935Z",
                            "updatedAt": "2023-04-19T17:00:04.375Z",
                            "name": "Bài trình bày 1",
                            "identifier": "48e4f3c3-8776-4a07-89c3-cc648256e88c",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 83,
                                "state": "presenting",
                                "counter": 1
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:56:52.056Z",
                            "updatedAt": "2023-04-19T06:56:52.085Z",
                            "name": "cWl58m9XuB",
                            "identifier": "78753b3b-c2e8-45f5-8762-7a11ff543bb8",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 82,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:48:43.529Z",
                            "updatedAt": "2023-04-19T06:48:43.545Z",
                            "name": "Bài trình bày 1",
                            "identifier": "05eab130-e233-43c3-b783-7c06a3989d26",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 81,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:48:23.332Z",
                            "updatedAt": "2023-04-19T06:48:23.339Z",
                            "name": "Select * from *",
                            "identifier": "5c9f1af5-61b7-41a8-bbae-bd0e164212fa",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 80,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:48:18.175Z",
                            "updatedAt": "2023-04-19T06:48:18.186Z",
                            "name": "Bài trình bày 1 @34$%52",
                            "identifier": "74341096-55fc-4831-b67f-d06fe38f521d",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 79,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:48:13.260Z",
                            "updatedAt": "2023-04-19T06:48:13.270Z",
                            "name": "@##!@$$#",
                            "identifier": "5c75cc5d-41f1-49e4-ab0c-af39a6819cc2",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 78,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:48:08.497Z",
                            "updatedAt": "2023-04-19T06:48:08.509Z",
                            "name": "Bài trình bày",
                            "identifier": "383cee3b-ee79-4529-a53c-3327ca08b206",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 77,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:48:03.560Z",
                            "updatedAt": "2023-04-19T06:48:03.573Z",
                            "name": "2",
                            "identifier": "8d1194b6-8b0e-4750-91f5-915be181cc03",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 76,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:47:58.625Z",
                            "updatedAt": "2023-04-19T06:47:58.632Z",
                            "name": "Bài trình bày 1",
                            "identifier": "661379a0-995b-456e-a97b-73024429864d",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 75,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        },
                        {
                            "createdAt": "2023-04-19T06:47:53.755Z",
                            "updatedAt": "2023-04-19T06:47:53.778Z",
                            "name": "cWl58m9XuB",
                            "identifier": "3df404a3-b89a-4995-acdb-1b6fc4047a70",
                            "ownerIdentifier": "ecc21d8e-a0f2-46df-9f26-df3651e88efc",
                            "ownerDisplayName": "Huu Danh",
                            "pace": {
                                "mode": "presenter",
                                "active_slide_id": 74,
                                "state": "idle",
                                "counter": 0
                            },
                            "closedForVoting": false,
                            "totalSlides": 1
                        }
                    ],
                    "pagination": {
                        "count": 74,
                        "page": 1,
                        "limit": 10
                    }
                }
            }
        
          ).as('getPresentations')
        cy.visit("/login");
        cy.get(".btn-primary").click();
        cy.get("#input").type("admin");
        cy.get("#normal_login_password").clear();
        cy.get("#normal_login_password").type("123");
        cy.get(".ant-btn").click();
        cy.get(".ant-btn").should("not.exist");

        /* ==== Generated with Cypress Studio ==== */
        cy.get('tbody > :nth-child(1) > :nth-child(2) > a').should("exist");

        /* ==== End Cypress Studio ==== */
    });
});
