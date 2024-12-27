import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { LessonType } from "./lesson.type";
import { LessonService } from "./lesson.service";
import { CreateLessonInput } from "./lesson.input";
import { AssignStudentsToLessonInput } from "./assign-students-to-lesson.input";
import { StudentService } from "src/student/student.service";
import { Lesson } from "./lesson.entity";

@Resolver((of) => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService
  ) {}

  // All lessons
  @Query((returns) => [LessonType])
  lessons() {
    return this.lessonService.getAllLessons();
  }

  @Query((returns) => LessonType)
  async lesson(@Args("id") id: string) {
    const lesson = await this.lessonService.getLesson(id);
    return lesson;
  }

  @Mutation((returns) => LessonType)
  createLesson(
    @Args("createLessonInput") createLessonInput: CreateLessonInput
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation((returns) => LessonType)
  assignStudentsToLesson(
    @Args("assignStudentsToLessonInput")
    { lessonId, studentIds }: AssignStudentsToLessonInput
  ) {
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    return this.studentService.getManyStudents(lesson.students);
  }
}
