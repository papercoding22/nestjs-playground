import { Test } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TaskRepository } from "./dto/task.repository";
import { TaskStatus } from "./dto/task-status.enum";

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
	findOneBy: jest.fn(),
});

const mockUser = {
  username: "Ariel",
  id: "someId",
  password: "somePassword",
  tasks: [],
};

describe("TasksService", () => {
  let tasksService: TasksService;
  let tasksRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe("getTasks", () => {
    it("calls TasksRepository.getTasks and returns the result", async () => {
      // @ts-ignore
      tasksRepository.getTasks.mockResolvedValue("someValue");
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual("someValue");
    });
  });

  describe("getTaskById", () => {
    it("calls TasksRepository.findOne and returns the result", async () => {
      const mockTask = {
        title: "Test title",
        description: "Test desc",
        id: "someId",
        status: TaskStatus.OPEN,
      };

			// @ts-ignore
      tasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById("someId", mockUser);
      expect(result).toEqual(mockTask);
    });

    it("calls TasksRepository.findOne and handles an error", async () => {
      // @ts-ignore
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById("someId", mockUser)).rejects.toThrow();
    });
  });
});
