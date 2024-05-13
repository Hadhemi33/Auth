import { Test, TestingModule } from '@nestjs/testing';
import { SpecialProductPriceService } from './special-product-price.service';

describe('SpecialProductPriceService', () => {
  let service: SpecialProductPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialProductPriceService],
    }).compile();

    service = module.get<SpecialProductPriceService>(SpecialProductPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
