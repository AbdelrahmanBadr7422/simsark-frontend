import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../services/post';
import { PropertyTypeValidator } from '../../validators/property-type.validator';
import { CreatePostResponse } from '../../models/postModels';
import { CommonModule } from '@angular/common';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-post.html',
})
export class NewPost implements OnInit {
  postForm!: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    address: FormControl<string | null>;
    propertyType: FormControl<string | null>;
    price: FormControl<number | null>;
    area: FormControl<number | null>;
    rooms: FormControl<number | null>;
    bathrooms: FormControl<number | null>;
    images: FormControl<string[] | null>;
  }>;

  isLoading = false;
  serverErrorMsg = '';
  successMessage = '';
  previewImages: string[] = [];
  selectedFiles: File[] = [];

  steps = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'location', label: 'Location & Type' },
    { key: 'details', label: 'Details' },
    { key: 'images', label: 'Images' },
    { key: 'review', label: 'Review' },
  ];
  currentStep = 0;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private postService = inject(Post);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.postForm = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.minLength(5)]),
      description: this.fb.control('', [Validators.required, Validators.minLength(10)]),
      address: this.fb.control('', Validators.required),
      propertyType: this.fb.control('', [Validators.required, PropertyTypeValidator()]),
      price: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
      area: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
      rooms: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
      bathrooms: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
      images: this.fb.control<string[] | null>([]),
    });
  }

  get controls() {
    return this.postForm.controls;
  }

  get progressPercent(): number {
    return (this.currentStep / (this.steps.length - 1)) * 100;
  }

  get mobileProgressPercent(): number {
    return this.progressPercent;
  }

  next() {
    if (!this.canProceedFromStep(this.currentStep)) {
      this.markStepTouched(this.currentStep);
      return;
    }
    if (this.currentStep < this.steps.length - 1) this.currentStep++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prev() {
    if (this.currentStep > 0) this.currentStep--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep(idx: number) {
    if (idx <= this.currentStep) {
      this.currentStep = idx;
      return;
    }
    if (this.canProceedFromStep(this.currentStep)) {
      this.currentStep = idx;
    } else {
      this.markStepTouched(this.currentStep);
    }
  }

  canProceedFromStep(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0:
        return this.controls.title.valid && this.controls.description.valid;
      case 1:
        return this.controls.address.valid && this.controls.propertyType.valid;
      case 2:
        return (
          this.controls.price.valid &&
          this.controls.area.valid &&
          this.controls.rooms.valid &&
          this.controls.bathrooms.valid
        );
      default:
        return true;
    }
  }

  markStepTouched(stepIndex: number) {
    const map: Record<number, (keyof typeof this.controls)[]> = {
      0: ['title', 'description'],
      1: ['address', 'propertyType'],
      2: ['price', 'area', 'rooms', 'bathrooms'],
      3: [],
    };
    (map[stepIndex] || []).forEach((field) => this.controls[field].markAsTouched());
  }

  onImageSelect(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target.result) {
          this.previewImages.push(e.target.result as string);
          this.postForm.patchValue({ images: [...this.previewImages] });
        }
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.postForm.patchValue({ images: [...this.previewImages] });
  }

  clearImages() {
    this.previewImages = [];
    this.selectedFiles = [];
    this.postForm.patchValue({ images: [] });
  }

  onFinalSubmit() {
    for (let i = 0; i < 3; i++) {
      if (!this.canProceedFromStep(i)) {
        this.markStepTouched(i);
        this.currentStep = i;
        return;
      }
    }
    this.createPost();
  }

  private createPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.serverErrorMsg = '';
    this.successMessage = '';

    const formData = new FormData();
    const form = this.postForm.value;

    formData.append('title', form.title || '');
    formData.append('description', form.description || '');
    formData.append('propertyType', form.propertyType || '');
    formData.append('price', String(form.price ?? ''));
    formData.append('area', String(form.area ?? ''));
    formData.append('rooms', String(form.rooms ?? ''));
    formData.append('bathrooms', String(form.bathrooms ?? ''));
    formData.append('address', form.address || '');

    this.selectedFiles.forEach((file) => formData.append('images', file));

    this.postService
      .createPost(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreatePostResponse) => {
          this.isLoading = false;
          this.successMessage = 'Post created successfully! Redirecting...';
          this.postForm.reset();
          this.previewImages = [];
          this.selectedFiles = [];
          setTimeout(() => this.router.navigate(['/explore']), 900);
        },
        error: (err) => {
          this.isLoading = false;
          this.serverErrorMsg = err?.error?.message || 'Something went wrong. Please try again.';
        },
      });
  }

  getFieldError(controlName: keyof typeof this.controls): string | null {
    const control = this.postForm.get(controlName);
    if (!control || !control.touched || !control.errors) return null;

    const errors = control.errors;
    if (errors['required']) return 'This field is required.';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}.`;
    if (errors['min']) return `Value must be at least ${errors['min'].min}.`;
    if (errors['invalidPropertyType']) return 'Invalid property type.';
    return null;
  }

  ngOnDestroy(){
    this.destroy$.next()
    this.destroy$.complete()
  }
}
