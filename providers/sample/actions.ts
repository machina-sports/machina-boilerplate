import { createAsyncThunk } from '@reduxjs/toolkit';
import { sampleService } from '@/providers/sample/service';

export const loadWelcome = createAsyncThunk('sample/loadWelcome', async () => {
  const response = await sampleService.getWelcome();
  return response.message;
});
