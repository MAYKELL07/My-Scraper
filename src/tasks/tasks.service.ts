import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(title: string, description: string): Task {
        const task: Task = {
            id: new Date().toISOString(),
            title,
            description,
            done: false,
        };

        this.tasks.push(task);
        return task;
    }

    // Implement other CRUD operations (update, delete) as needed
}
