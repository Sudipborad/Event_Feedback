import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Register User controller
 */
export async function register(request, reply) {
  const { name, email, password } = request.body || {};

  // Request validation
  if (!name || !name.trim() || !email || !email.trim() || !password) {
    return reply.status(400).send({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return reply.status(400).send({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.status(400).send({ error: 'User with this email already exists' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Auto-promote to admin if email domain is @admin.com
    const role = email.toLowerCase().endsWith('@admin.com') ? 'admin' : 'user';

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    reply.status(201);
    return { success: true, message: 'User registered successfully' };
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Registration failed' };
  }
}

/**
 * Login User controller
 */
export async function login(request, reply) {
  const { email, password } = request.body || {};

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return reply.status(400).send({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(400).send({ error: 'Invalid email or password' });
    }

    // Sign JWT Token
    const token = request.server.jwt.sign({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Login failed' };
  }
}

/**
 * Promote User to Admin via secret passcode
 */
export async function promote(request, reply) {
  const { email, code } = request.query || {};

  if (!email || !code) {
    return reply.status(400).send({ error: 'Email and promotion code are required' });
  }

  // Passcode is admin123
  if (code !== 'admin123') {
    return reply.status(403).send({ error: 'Invalid promotion code' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return { 
      success: true, 
      message: `User ${email} has been promoted to Admin successfully!` 
    };
  } catch (err) {
    request.log.error(err);
    reply.status(500);
    return { error: 'Promotion failed' };
  }
}
