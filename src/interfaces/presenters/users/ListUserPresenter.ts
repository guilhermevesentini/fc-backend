import { UserDto } from "../../../application/dtos/users/usersDto";


export class ListUserPresenter {
  public list(users: UserDto[]): UserDto[] {
    return users.map((u) => {
      return {
        id: u.id,
        username: u.username,
      };
    });
  }
}
