/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomFormComponent } from './custom-form.component';

describe('CustomFormComponent', () => {
  let component: CustomFormComponent;
  let fixture: ComponentFixture<CustomFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomFormComponent, HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.form.reset();
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('should have valid form with correct data', () => {
    component.form.setValue({
      id: 'abc123',
      name: 'Producto Test',
      description: 'Descripción válida para test',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });
    fixture.detectChanges();
    expect(component.form.valid).toBe(true);
  });

  it('should emit formSubmit on valid submit', () => {
    const spy = jest.spyOn(component.formSubmit, 'emit');
    component.form.setValue({
      id: 'abc123',
      name: 'Producto Test',
      description: 'Descripción válida para test',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });
    fixture.detectChanges();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should reset form on onReset()', () => {
    component.form.setValue({
      id: 'abc123',
      name: 'Producto Test',
      description: 'Descripción válida para test',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });
    fixture.detectChanges();
    component.onReset();
    expect(component.form.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null
    });
  });
});
