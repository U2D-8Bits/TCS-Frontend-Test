import { TestBed } from '@angular/core/testing';
import { ModalService, ModalConfig, ModalResult } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show modal with basic configuration', (done) => {
    const config: ModalConfig = {
      title: 'Test Title',
      text: 'Test Text',
      icon: 'success'
    };

    service.show(config).then((result: ModalResult) => {
      expect(result).toBeDefined();
      done();
    });

    // Simulate confirmation
    setTimeout(() => {
      service.confirm();
    }, 100);
  });

  it('should return confirmed result when confirm is called', (done) => {
    service.fire('Test', 'Test message').then((result: ModalResult) => {
      expect(result.isConfirmed).toBe(true);
      expect(result.isDenied).toBe(false);
      expect(result.isDismissed).toBe(false);
      done();
    });

    setTimeout(() => {
      service.confirm();
    }, 100);
  });

  it('should return denied result when cancel is called', (done) => {
    service.question('Test', 'Test question').then((result: ModalResult) => {
      expect(result.isConfirmed).toBe(false);
      expect(result.isDenied).toBe(true);
      expect(result.isDismissed).toBe(false);
      done();
    });

    setTimeout(() => {
      service.cancel();
    }, 100);
  });

  it('should return dismissed result when close is called', (done) => {
    service.info('Test', 'Test info').then((result: ModalResult) => {
      expect(result.isConfirmed).toBe(false);
      expect(result.isDenied).toBe(false);
      expect(result.isDismissed).toBe(true);
      done();
    });

    setTimeout(() => {
      service.close();
    }, 100);
  });

  it('should auto close with timer', (done) => {
    const startTime = Date.now();
    
    service.show({
      title: 'Timer Test',
      timer: 100
    }).then((result: ModalResult) => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(result.isDismissed).toBe(true);
      done();
    });
  });

  it('should emit modal config through observable', (done) => {
    const config: ModalConfig = {
      title: 'Observable Test',
      text: 'Testing observable'
    };

    service.getModalConfig().subscribe(modalConfig => {
      if (modalConfig) {
        expect(modalConfig.title).toBe('Observable Test');
        expect(modalConfig.text).toBe('Testing observable');
        done();
      }
    });

    service.show(config);
  });

  describe('convenience methods', () => {
    it('should show success modal', (done) => {
      service.success('Success', 'Success message').then((result: ModalResult) => {
        expect(result).toBeDefined();
        done();
      });

      setTimeout(() => service.confirm(), 50);
    });

    it('should show error modal', (done) => {
      service.error('Error', 'Error message').then((result: ModalResult) => {
        expect(result).toBeDefined();
        done();
      });

      setTimeout(() => service.confirm(), 50);
    });

    it('should show warning modal', (done) => {
      service.warning('Warning', 'Warning message').then((result: ModalResult) => {
        expect(result).toBeDefined();
        done();
      });

      setTimeout(() => service.confirm(), 50);
    });

    it('should show info modal', (done) => {
      service.info('Info', 'Info message').then((result: ModalResult) => {
        expect(result).toBeDefined();
        done();
      });

      setTimeout(() => service.confirm(), 50);
    });

    it('should show loading modal', (done) => {
      service.loading('Loading', 'Loading message').then((result: ModalResult) => {
        expect(result).toBeDefined();
        done();
      });

      setTimeout(() => service.close(), 50);
    });

    it('should show toast modal with timer', (done) => {
      const startTime = Date.now();
      
      service.toast('Toast message', 'success', 100).then((result: ModalResult) => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(90);
        expect(result.isDismissed).toBe(true);
        done();
      });
    });
  });
});
