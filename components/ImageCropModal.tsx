import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (image: string) => void;
  initialImageSrc?: string | null;
}

// Utility function to crop the image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * maxSize;

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(-safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(-safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );
  
  return canvas.toDataURL('image/png');
}


const ImageCropModal: React.FC<ImageCropModalProps> = ({ isOpen, onClose, onSave, initialImageSrc }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (isOpen && initialImageSrc) {
        setImageSrc(initialImageSrc);
    }
  }, [isOpen, initialImageSrc]);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onSave(croppedImage);
        handleClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Player Image" size="lg">
      <div className="space-y-4">
        <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="round"
              showGrid={false}
            />
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Upload an image to begin.</p>
                <p className="text-xs mt-1">Center the face inside the circle for best results on the player card.</p>
             </div>
          )}
        </div>

        {imageSrc && (
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">Zoom</label>
            <Input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div>
        )}

        <div>
            <label htmlFor="image-upload-input" className="text-sm font-medium text-gray-300 block mb-1">
                {imageSrc ? 'Change Image' : 'Select Image'}
            </label>
            <Input id="image-upload-input" type="file" onChange={handleFileChange} accept="image/*" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={handleClose} variant="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="primary" disabled={!imageSrc}>
            Save Image
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropModal;