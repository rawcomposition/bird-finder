import mongoose from 'mongoose';
const { Schema } = mongoose;
mongoose.pluralize(null);

const schema = mongoose.Schema({
	average: Schema.Types.Decimal128,
	hotspotId: String,
	totalSamples: Number,
	speciesName: String,
	speciesCode: String,
	hotspotName: String,
	updatedAt: Date,
});

export default mongoose.model("abundance", schema);