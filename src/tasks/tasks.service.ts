import { Inject, NotFoundException } from "@nestjs/common";

import { TaskStatus } from "./dto/task-status.enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./dto/task.entity";
import { TaskRepository } from "./dto/task.repository";
import { User } from "src/auth/user.entity";

export class TasksService {
  private tasks: Task[] = [];

  constructor(
    @Inject(TaskRepository) private readonly taskRepository: TaskRepository
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks(filterDto, user);
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    // Note: we don't need to find the task first before deleting it
    // because the delete method will not throw an error if the task is not found
    // Good for performance because we don't need to make an extra query to the database
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
