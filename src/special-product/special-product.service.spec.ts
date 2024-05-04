import { Test, TestingModule } from '@nestjs/testing';
import { SpecialProductService } from './special-product.service';

describe('SpecialProductService', () => {
  let service: SpecialProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialProductService],
    }).compile();

    service = module.get<SpecialProductService>(SpecialProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
