import { Test, TestingModule } from '@nestjs/testing';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageStatus, UpdateMessageDto } from './dto/update-message.dto';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  const mockMessagesService = {
    create: jest.fn(),
    findBySender: jest.fn(),
    findByPeriod: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a message', async () => {
    const dto: CreateMessageDto = { content: 'teste', sender: 'jackeline' };
    const result = { id: '1', ...dto };
    mockMessagesService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find messages by sender', async () => {
    const sender = 'jackeline';
    const result = [{ id: '1', content: 'teste', sender }];
    mockMessagesService.findBySender.mockResolvedValue(result);

    expect(await controller.findBySender(sender)).toEqual(result);
    expect(service.findBySender).toHaveBeenCalledWith(sender);
  });

  it('should find messages by period', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';
    const result = [{ id: '1', content: 'teste', sender: 'jackeline' }];
    mockMessagesService.findByPeriod.mockResolvedValue(result);

    expect(await controller.findByPeriod(startDate, endDate)).toEqual(result);
    expect(service.findByPeriod).toHaveBeenCalledWith(startDate, endDate);
  });

  it('should find message by ID', async () => {
    const id = 'abc123';
    const result = { id, content: 'teste', sender: 'jackeline' };
    mockMessagesService.findById.mockResolvedValue(result);

    expect(await controller.findById(id)).toEqual(result);
    expect(service.findById).toHaveBeenCalledWith(id);
  });

  it('should update message status', async () => {
    const id = 'abc123';
    const updateDto: UpdateMessageDto = { status: MessageStatus.ENVIADO };
    const result = { id, content: 'teste', status: MessageStatus.ENVIADO };
    mockMessagesService.update.mockResolvedValue(result);

    expect(await controller.update(id, updateDto)).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(id, updateDto);
  });
});
