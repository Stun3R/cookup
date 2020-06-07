import { TestBed } from '@angular/core/testing';

import { StockViewResolverService } from './stock-view-resolver.service';

describe('StockViewResolverService', () => {
  let service: StockViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
