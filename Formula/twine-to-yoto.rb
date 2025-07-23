class TwineToYoto < Formula
  desc "Convert Twine/Twee documents to TweeJSON and YotoJSON"
  homepage "https://github.com/yotoplay/twine-to-yoto"
  version "1.9.0"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/yotoplay/twine-to-yoto/releases/download/v1.9.0/twine2yoto-macos-arm64.zip"
      sha256 "PLACEHOLDER_SHA256"
    else
      url "https://github.com/yotoplay/twine-to-yoto/releases/download/v1.9.0/twine2yoto-macos-x64.zip"
      sha256 "PLACEHOLDER_SHA256"
    end
  end

  def install
    bin.install "twine2yoto"
  end

  test do
    system "#{bin}/twine2yoto", "--help"
  end
end 