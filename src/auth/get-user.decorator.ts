import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export default GetUser;
