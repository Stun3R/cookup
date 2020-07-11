import { DayjsRecipePipe } from "./dayjs-recipe.pipe";

describe("DayjsRecipePipe", () => {
  it("create an instance", () => {
    const pipe = new DayjsRecipePipe();
    expect(pipe).toBeTruthy();
  });
});
