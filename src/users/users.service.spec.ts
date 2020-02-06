// import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";

describe("Users Service test", () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
  });

  // afterEach(() => setTimeout(() => process.exit(), 1000));

  describe("findUser", () => {
    it("Should return user", async () => {
      const result: any = {
        iduser: 26,
        fname: "Oscar",
        lname: "Lopez",
        email: "oscarlopez75@gmail.com",
        password:
          "$2a$10$opC273unfc0S4Qp50J.FOus.sumTdKrDMmHkq/sfxbI7f39V0auvy",
        phone: "",
        created: "2020-01-12T14:17:29.057Z",
        role: "user",
        status: "active",
      };

      jest
        .spyOn(usersService, "getUser")
        .mockImplementation(() => Promise.resolve(result));

      const RESULT = await usersService.getUser(
        "oscarlopez75@gmail.com",
        "brand_two",
      );

      expect(RESULT).toBe(result);
    });
  });

  describe("findUser querying", () => {
    it("Should return user", async () => {
      const ExpectedResult: any = {
        iduser: 26,
        fname: "Oscar",
        lname: "Lopez",
        email: "oscarlopez75@gmail.com",
        password:
          "$2a$10$opC273unfc0S4Qp50J.FOus.sumTdKrDMmHkq/sfxbI7f39V0auvy",
        phone: "",
        created: "2020-01-12T14:17:29.057Z",
        role: "user",
        status: "active",
      };

      expect(
        await usersService.getUser("oscarlopez75@gmail.com", "brand_two"),
      ).toEqual(ExpectedResult);
    });

    it("Should return an error", async () => {
      try {
        const USER = await usersService.getUser(
          "oscarlopez75x@gmail.com",
          "brand_two",
        );
      } catch (error) {
        expect(error.message).toEqual(
          "Not able to get user with email oscarlopez75x@gmail.com at brand brand_two Error: no elements in sequence",
        );
      }
    });
  });
});
