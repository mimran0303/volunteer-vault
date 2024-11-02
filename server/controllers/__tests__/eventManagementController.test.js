const { getEvents, createEventManagement, editEvent, deleteEvent} = require('../eventManagementController');
const db = require('../../config/index');

jest.mock('../../config/index');

describe('eventManagementController', () => {
  let req, res, mockDbConnection;

  beforeEach(() => {
    req = { user: { userId: 1 } };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    mockDbConnection = {
      query: jest.fn(),
      end: jest.fn(),
    };

    db.mockResolvedValue(mockDbConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should retrieve events for a specific admin', async () => {
      const events = [
        { event_id: 1, event_name: 'Community Cleanup' },
        { event_id: 2, event_name: 'Charity Run' },
      ];
      mockDbConnection.query.mockResolvedValue([events]);

      await getEvents(req, res);

      expect(db).toHaveBeenCalled();
      expect(mockDbConnection.query).toHaveBeenCalledWith(
        'SELECT * FROM eventdetails WHERE event_admin_id = ?',
        [req.user.userId]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should return a 500 status on database error', async () => {
      mockDbConnection.query.mockRejectedValue(new Error('Database error'));

      await getEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Failed to retrieve events.' });
    });
  });

  describe('createEventManagement', () => {
    beforeEach(() => {
      req.body = {
        eventName: 'Charity Run',
        eventDescription: 'A run to raise funds for charity',
        location: 'City Park',
        city: 'Example City',
        state: 'TX',
        zipcode: '12345',
        skills: 'Research Skills',
        urgency: 'High',
        date: '2024-12-01',
      };
    });

    it('should create a new event', async () => {
      mockDbConnection.query.mockResolvedValue([{ insertId: 1 }]);

      await createEventManagement(req, res);

      expect(db).toHaveBeenCalled();
      expect(mockDbConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO eventdetails'),
        [
          req.user.userId,
          req.body.eventName,
          req.body.eventDescription,
          req.body.location,
          req.body.city,
          req.body.state,
          req.body.zipcode,
          req.body.skills,
          req.body.urgency,
          req.body.date,
        ]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event created successfully' });
    });

    it('should return a 500 status on database error', async () => {
      mockDbConnection.query.mockRejectedValue(new Error('Database error'));

      await createEventManagement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Failed to create event.' });
    });
  });

  describe('editEvent', () => {
    beforeEach(() => {
      req.params = { id: 1 };
      req.body = {
        eventName: 'Updated Event',
        eventDescription: 'Updated description',
        location: 'Updated location',
        city: 'Updated city',
        state: 'TX',
        zipcode: '54321',
        skills: 'Research skills',
        urgency: 'High',
        date: '2024-12-15',
      };
    });

    it('should update an existing event', async () => {
      mockDbConnection.query.mockResolvedValue([{ affectedRows: 1 }]);

      await editEvent(req, res);

      expect(db).toHaveBeenCalled();
      expect(mockDbConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE eventdetails SET'),
        [
          req.body.eventName,
          req.body.eventDescription,
          req.body.location,
          req.body.city,
          req.body.state,
          req.body.zipcode,
          req.body.skills,
          req.body.urgency,
          req.body.date,
          parseInt(req.params.id),
          req.user.userId,
        ]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event updated successfully' });
    });

    it('should return a 404 if the event is not found', async () => {
      mockDbConnection.query.mockResolvedValue([{ affectedRows: 0 }]);

      await editEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Event not found or unauthorized.' });
    });

    it('should return a 500 status on database error', async () => {
      mockDbConnection.query.mockRejectedValue(new Error('Database error'));

      await editEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Failed to update event.' });
    });
  });

  describe('deleteEvent', () => {
    beforeEach(() => {
      req.params = { id: '1' };
    });

    it('should delete an event', async () => {
      mockDbConnection.query.mockResolvedValue([{ affectedRows: 1 }]);

      await deleteEvent(req, res);

      expect(db).toHaveBeenCalled();
      expect(mockDbConnection.query).toHaveBeenCalledWith(
        'DELETE FROM eventdetails WHERE event_id = ?',
        [parseInt(req.params.id)]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
    });

    it('should return a 404 if the event to delete is not found', async () => {
      mockDbConnection.query.mockResolvedValue([{ affectedRows: 0 }]);

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Event not found or unauthorized.' });
    });

    it('should return a 500 status on database error', async () => {
      mockDbConnection.query.mockRejectedValue(new Error('Database error'));

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ Error: 'Failed to delete event.' });
    });
  });
});


