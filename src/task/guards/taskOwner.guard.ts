import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskService } from '../task.service';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private taskService: TaskService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request.user;
    const taskId = Number(request.params.id);

    return this.validateRequest(user, taskId);
  }

  async validateRequest(user: any, taskId: number): Promise<boolean> {
    const task = await this.taskService.getTaskById(taskId);
    if (user.id !== task.user_id) {
      throw new UnauthorizedException('Invalid user id');
    }

    return true;
  }
}
