import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../interfaces/task';
import {TaskService} from '../../services/task.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: Task;
  @Output() removeTask: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;
  form: FormGroup;
  taskFormId: number;
  submitted = false;
  submittedSave = false;
  description: string;
  priority: number;
  constructor(public taskService: TaskService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      description: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required])
    });
    this.description = this.task.description;
    this.priority = this.task.priority;
    this.taskFormId = Math.floor(Math.random() * 100000);
  }
  editTaskForm() {
    this.submitted = !this.submitted;
    this.editMode = !this.editMode;
  }
  save() {
    this.submittedSave = true;
    const task: Task = {
      description: this.task.description,
      priority: this.task.priority
    };
    this.taskService.update(this.task._id.toString(), task).subscribe(() => {
      this.editTaskForm();
      this.submittedSave = false;
    }, () => {
      this.submittedSave = false;
    });
  }
  reset() {
    this.form.reset({description: this.description, priority: this.priority});
    this.editTaskForm();
  }
  completed() {
    this.taskService.update(this.task._id.toString(), {completed: !this.task.completed}).subscribe(() => {
      this.task.completed = !this.task.completed;
    });
  }
  remove() {
    this.taskService.delete(this.task._id.toString()).subscribe(() => {
      this.router.navigate(['/tasks']);
      this.removeTask.emit(this.task._id.toString());
    });
  }
}
