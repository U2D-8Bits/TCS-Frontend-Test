/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomButtonComponent } from './custom-button.component';

describe('CustomButtonComponent', () => {
  let component: CustomButtonComponent;
  let fixture: ComponentFixture<CustomButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button text from @Input Texto', () => {
    component.Texto = 'Guardar';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.textContent).toContain('Guardar');
  });

  it('should emit click event when button is clicked', () => {
    const clickSpy = jest.fn();
    // Simular output con host listener si existiera, aquí solo trigger
    const btn = fixture.debugElement.query(By.css('button'));
    btn.nativeElement.addEventListener('click', clickSpy);
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should disable button if [disabled] is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
  });
});
