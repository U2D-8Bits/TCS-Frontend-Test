/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomInputComponent } from './custom-input.component';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomInputComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input value from value property', () => {
    component.value = 'test value';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.value).toBe('test value');
  });

  it('should call onChange when input changes', () => {
    const spy = jest.spyOn(component, 'onChange');
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'nuevo';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('nuevo');
  });

  it('should show error message if showError and errorMessage are set', () => {
    component.showError = true;
    component.errorMessage = 'Campo requerido';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.custom-input-error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Campo requerido');
  });
});
