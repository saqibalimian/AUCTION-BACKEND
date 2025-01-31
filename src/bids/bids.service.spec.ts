import { Test, TestingModule } from '@nestjs/testing';
import { BidsService } from './bids.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bid } from '../entities/bid.entity';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';
import { BidsGateway } from './bids.gateway';

describe('BidsService', () => {
  let bidsService: BidsService;

  // Mock repositories
  const mockBidRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockItemRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockBidsGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        {
          provide: getRepositoryToken(Bid),
          useValue: mockBidRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: BidsGateway,
          useValue: mockBidsGateway,
        },
      ],
    }).compile();

    bidsService = module.get<BidsService>(BidsService);
  });

  it('should be defined', () => {
    expect(bidsService).toBeDefined();
  });

  describe('placeBid', () => {
    it('should return an error if the item is not found', async () => {
      mockItemRepository.findOne.mockResolvedValue(null);

      const result = await bidsService.placeBid({
        item_id: 1,
        user_id: 1,
        amount: 600,
      });

      expect(result).toEqual({ success: false, message: 'Item not found' });
    });

   
    it('should return an error if the bid is not higher than the current highest bid', async () => {
      const mockItem = {
        id: 1,
        name: 'Test Item',
        starting_price: 500,
        auction_duration: new Date(Date.now() + 10000), // Auction active
        bids: [{ amount: 600 }],
      };
     


    });
  });
});